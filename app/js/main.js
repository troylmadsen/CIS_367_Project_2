import * as THREE from 'three';
import Lighthouse from './models/Lighthouse';
import Boat from './models/Boat';
import PlacementGrid from './models/PlacementGrid';

export default class App {
  constructor() {
    this._canvas = document.getElementById('mycanvas');

    // Enable antialias for smoother lines.
    this.renderer = new THREE.WebGLRenderer({canvas: this._canvas, antialias: true});

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
    this.camera.matrixAutoUpdate = false;
    var cameraPos = new THREE.Matrix4().makeTranslation(0, 0, 100);
    this.camera.matrixWorld.multiply(cameraPos);

    // Mouse buttons
    this.STATE = {NONE: -1, LEFT: 0, MIDDLE: 1, RIGHT: 2};
    this._state = this.STATE.NONE;

    // Control speeds
    this.rotateSpeed = 1;
    this.panSpeed = 1;
    this.zoomSpeed = 1;

    // Which object is being controlled by the mouse
    this._controlFocus = "camera";

    // Dictionary of controllables for _controlFocus
    this.CONTROLLABLES = {};
    this.CONTROLLABLES["camera"] = this.camera;

    // Adding skybox.
    const skyboxGeom = new THREE.SphereGeometry(100, 32, 32);
    const skyboxMatr = new THREE.MeshPhongMaterial({color: 0xff00ff, side: THREE.BackSide});
    const skybox = new THREE.Mesh(skyboxGeom, skyboxMatr);
    this.scene.add(skybox);

    // Adding directional light.
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    this.directionalLight.position.set(10, 40, 100);
    this.scene.add(this.directionalLight);

    // Adding lighthouse.
    this.lighthouse = new Lighthouse();
    this.lighthouse.matrixAutoUpdate = false;
    this.lighthouse.lamp.matrixAutoUpdate = false;
    this.scene.add(this.lighthouse);
    this.CONTROLLABLES["lighthouse"] = this.lighthouse;

    // Adding ambient light.
    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // Adding the boat.
    this.boat = new Boat(1);
    this.boat.matrixAutoUpdate = false;
    this.scene.add(this.boat);
    this.CONTROLLABLES["boat"] = this.boat;

    // Adding the placement grid.
    this.placementgrid = new PlacementGrid();
    this.placementgrid.rotateX(Math.PI / 2);
    // this.scene.add(this.placementgrid);
    this.placementgrid.position.y = -25;

    // Use real-time to aid boat circuit.
    this.initialMilliseconds = (new Date()).getTime();
    this.cycleTotalMilliseconds = 10000;

    this.addHandlers();
    this.resizeHandler();
    requestAnimationFrame((time) => this.render(time));
  }

  // Updates for animation.
  render(ts) {
    this.renderer.render(this.scene, this.camera);

    // Rotates the Propeller
    this.boat.render();

    // Rotates the lighthouse lamp
    this.lighthouse.render();

    // Controlling the position of the boat to a cycle.
    let newMilliSecondTime = (new Date()).getTime();
    // let newMilliSecondTime = ts;
    var timeDifference = newMilliSecondTime - this.initialMilliseconds;
    timeDifference = timeDifference % this.cycleTotalMilliseconds;
    let timePercentage = timeDifference / this.cycleTotalMilliseconds;

    // Use timePercentage as the "S" value in a parametric equation to get
    // new values for X and Y.
    var t = timePercentage * 2 * Math.PI;
    var boatXPosition = 52 * Math.cos(t);
    var boatYPosition = 30 * Math.sin(t);

    // First derivative - The direction of the boat.
      // dx/dt = 52 * -sin(t)
      // dy/dt = 25 * cos(t)
    var secondLine = new THREE.Vector3( (-52 * Math.sin(t)), (30 * Math.cos(t)), 0);
    var xLine = new THREE.Vector3(1, 0, 0);
    var n = xLine.angleTo(secondLine);
    if (this.lastN === undefined || this.lastN === null) {
      this.lastN = n;
      this.boat.matrix.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(12) ));
    }

    this.boat.matrix.setPosition(new THREE.Vector3(boatXPosition, -24, boatYPosition));
    this.boat.matrix.multiply(new THREE.Matrix4().makeRotationY(-1 * Math.abs(n - this.lastN) ));
    this.lastN = n;

    requestAnimationFrame((time) => this.render(time));
  }

  getMouseLocation(pageX, pageY) {
      var locVec = new THREE.Vector2();

      locVec.set(
          (pageX - this._canvas.left) / this._canvas.width,
          (pageY - this._canvas.top) / this._canvas.height
      );

      return locVec;
  }

  addHandlers() {
      // Disable right-click for canvas
      this._canvas.oncontextmenu = function(e) {
          return false
      };

      // Resize handler
      window.addEventListener('resize', () => this.resizeHandler());

      // Keyboard handler
      this.keydown = this.keydownHandler.bind(this);
      this.keyup = this.keyupHandler.bind(this);
      window.addEventListener("keydown", this.keydown);
      window.addEventListener("keyup", this.keyup);

      // Mouse control handlers
      this._canvas.addEventListener("wheel", this.wheelHandler.bind(this));
      this.mousedown = this.mousedownHandler.bind(this);
      this._canvas.addEventListener("mousedown", this.mousedown);
      this.mouseup = this.mouseupHandler.bind(this);
      this.mousemove = this.mousemoveHandler.bind(this);

      // Radio button control
      document.getElementById("radioButtons").addEventListener("change", this.radioButtonHandler.bind(this));

      // Directional light control handler
      document.getElementById("directionalLight").addEventListener("change", this.directionalLightHandler.bind(this));

      // Spotlight control handler
      document.getElementById("spotlight").addEventListener("change", this.spotlightHandler.bind(this));
  }

  // Handles page resizing.
  resizeHandler() {
    // const canvas = document.getElementById("mycanvas");
    let w = window.innerWidth - 16;
    let h = 0.75 * w;  /* maintain 4:3 ratio */
    if (this._canvas.offsetTop + h > window.innerHeight) {
      h = window.innerHeight - this._canvas.offsetTop - 16;
      w = 4/3 * h;
    }
    this._canvas.width = w;
    this._canvas.height = h;
    this._canvas.left = this._canvas.getBoundingClientRect().left;
    this._canvas.top = this._canvas.getBoundingClientRect().top;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  // Handles keyboard events for object control.
  keydownHandler(event) {
    window.removeEventListener("keydown", this.keydown);

    var whichRadio = "";
    if (document.getElementById('boat_but').checked == true) {
      whichRadio = "boat";
    } else if (document.getElementById('lighthouse_but').checked == true) {
      whichRadio = "lighthouse";
    }

    var keycode = event.keyCode || event.which;
    switch (keycode) {

      // SPACE
      case 32:
        console.log("SPACE");
        if (whichRadio == "boat") {
          console.log("BOAT");


        } else if (whichRadio == "lighthouse") {
          console.log("LIGHTHOUSE");
        }
        break;

      // DEFAULT
      default:
        console.log("SOMEKEY");
    }
  }

  // Handles keyup events by readding the keydown handler
  keyupHandler(event) {
      window.addEventListener('keydown', this.keydown);
  }

  // Handles wheel events by zooming the camera forward or backward depending on
  // wheel direction
  wheelHandler(event) {
      var direction = event.deltaY;
      if (direction > 0) {
          // Scroll down
          if (this._controlFocus === "camera") {
              this.CONTROLLABLES[this._controlFocus].matrixWorld.multiply(new THREE.Matrix4().makeTranslation(0, 0, 3 * this.zoomSpeed));
          } else {
              this.CONTROLLABLES[this._controlFocus].matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, 3 * this.zoomSpeed));
          }
      } else {
          // Scroll up
          if (this._controlFocus === "camera") {
              this.CONTROLLABLES[this._controlFocus].matrixWorld.multiply(new THREE.Matrix4().makeTranslation(0, 0, -3 * this.zoomSpeed));
          } else {
              this.CONTROLLABLES[this._controlFocus].matrix.multiply(new THREE.Matrix4().makeTranslation(0, 0, -3 * this.zoomSpeed));
          }
      }
  }

  // Handles mousedown events by adding the mouseup and mousemove handlers and
  // determines which mouse button was pressed
  mousedownHandler(event) {

      // Set mouse state
      if (this._state === this.STATE.NONE) {
          this._state = event.button;
      }

      this._moveCurr = this.getMouseLocation(event.pageX, event.pageY);

      this._canvas.addEventListener('mousemove', this.mousemove);
      this._canvas.addEventListener('mouseup', this.mouseup);
  }

  // Hanldes mousemove events
  mousemoveHandler(event) {
      this._movePrev = this._moveCurr;
      this._moveCurr = this.getMouseLocation(event.pageX, event.pageY);
      var deltaX = this._moveCurr.x - this._movePrev.x;
      var deltaY = this._moveCurr.y - this._movePrev.y;

      // Take appropriate action depending on button
      if (this._state === this.STATE.LEFT) {
          var rotX = new THREE.Matrix4().makeRotationX(deltaY * Math.PI * this.rotateSpeed);
          var rotY = new THREE.Matrix4().makeRotationY(deltaX * Math.PI * this.rotateSpeed);
          if (this._controlFocus === "camera") {
              this.CONTROLLABLES[this._controlFocus].matrixWorld.multiply(new THREE.Matrix4().makeRotationX(deltaY * Math.PI * this.rotateSpeed));
              this.CONTROLLABLES[this._controlFocus].matrixWorld.multiply(new THREE.Matrix4().makeRotationY(deltaX * Math.PI * this.rotateSpeed));
          } else {
              this.CONTROLLABLES[this._controlFocus].matrix.multiply(new THREE.Matrix4().makeRotationX(-1 * deltaY * Math.PI * this.rotateSpeed));
              this.CONTROLLABLES[this._controlFocus].matrix.multiply(new THREE.Matrix4().makeRotationY(-1 * deltaX * Math.PI * this.rotateSpeed));
          }
      } else if (this._state === this.STATE.MIDDLE) {
          var rotZ = new THREE.Matrix4().makeRotationZ(deltaX * Math.PI * this.rotateSpeed);
          if (this._controlFocus === "camera") {
              this.CONTROLLABLES[this._controlFocus].matrixWorld.multiply(new THREE.Matrix4().makeRotationZ(deltaX * Math.PI * this.rotateSpeed));
          } else {
              this.CONTROLLABLES[this._controlFocus].matrix.multiply(new THREE.Matrix4().makeRotationZ(-1 * deltaX * Math.PI * this.rotateSpeed));
          }
      } else if (this._state === this.STATE.RIGHT) {
          var pan = new THREE.Matrix4().makeTranslation(-100 * deltaX * this.panSpeed, 100 * deltaY * this.panSpeed, 0);
          if (this._controlFocus === "camera") {
              this.CONTROLLABLES[this._controlFocus].matrixWorld.multiply(new THREE.Matrix4().makeTranslation(-100 * deltaX * this.panSpeed, 100 * deltaY * this.panSpeed, 0));
          } else {
              this.CONTROLLABLES[this._controlFocus].matrix.multiply(new THREE.Matrix4().makeTranslation(100 * deltaX * this.panSpeed, 100 * deltaY * this.panSpeed, 0));
          }
      }
  }

  // Handles mouseup events
  mouseupHandler(event) {
      // Restore mouse to no state
      this._state = this.STATE.NONE;

      this._canvas.removeEventListener('mousemove', this.mousemove);
      this._canvas.removeEventListener('mouseup', this.mouseup);
  }

  radioButtonHandler(event) {
      var buts = document.getElementById("radioButtons");
      for (var i = 0; i < buts.length; i++) {
          if (buts[i].checked) {
              this._controlFocus = buts[i].value;
              break;
          }
      }
  }

  directionalLightHandler(event) {
      this.directionalLight.visible = !this.directionalLight.visible;
  }

  spotlightHandler(event) {
      this.lighthouse.lamp.spotlight.visible = !this.lighthouse.lamp.spotlight.visible;
  }
}
