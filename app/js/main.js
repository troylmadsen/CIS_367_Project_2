import * as THREE from 'three';
// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Lighthouse from './models/Lighthouse';
import Boat from './models/Boat';
import PlacementGrid from './models/PlacementGrid';

//FIXME remove this
import {BoxGeometry, Matrix4, Mesh, MeshPhongMaterial} from 'three';

export default class App {
  constructor() {
    const c = document.getElementById('mycanvas');
    // Enable antialias for smoother lines
    this.renderer = new THREE.WebGLRenderer({canvas: c, antialias: true});
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, 4/3, 0.5, 500);
    this.camera.position.z = 100;

    // const orbiter = new OrbitControls(this.camera);
    // orbiter.enableZoom = false;
    // orbiter.update();
    this.tracker = new TrackballControls(this.camera);
    this.tracker.rotateSpeed = 2.0;
    this.tracker.noZoom = false;
    this.tracker.noPan = false;

    // Keyboard Listener
    window.addEventListener("keydown", this.keydownHandler.bind(this));

    // FIXME replace this with boat
    // this.boat_deg = 0;
    // this.deg_change_rate = 2 * Math.PI / 2000;
    //
    // var boatGeom = new BoxGeometry(5, 5, 10);
    // var boatMatr = new MeshPhongMaterial({color: 0x00ff00});
    // this.boat = new Mesh(boatGeom, boatMatr);
    // this.boat.matrixAutoUpdate = false;
    // var offset = new Matrix4().makeTranslation(0, 0, 20);
    // this.boat.matrix.multiply(offset);
    // this.scene.add(this.boat);
    // this.ghost = new Ghost(0x505050);
    // this.ghost.matrixAutoUpdate = false;
    // this.scene.add(this.ghost);

    //FIXME remove this
    const marker1 = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 1), new THREE.MeshPhongMaterial({color: 0x0000ff}));
    marker1.rotateX(Math.PI / 2);
    marker1.translateY(50);
    this.scene.add(marker1);

    //FIXME remove this
    const marker2 = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 1), new THREE.MeshPhongMaterial({color: 0x0000ff}));
    marker2.rotateX(Math.PI / 2);
    marker2.translateY(-50);
    this.scene.add(marker2);

    const skyboxGeom = new THREE.SphereGeometry(100, 32, 32);
    const skyboxMatr = new MeshPhongMaterial({color: 0xff00ff, side: THREE.BackSide});
    const skybox = new Mesh(skyboxGeom, skyboxMatr);
    this.scene.add(skybox);

    this.lighthouse = new Lighthouse();
    this.scene.add(this.lighthouse);

    const lightOne = new THREE.DirectionalLight(0xffffff, 1.0);
    lightOne.position.set(10, 40, 100);
    this.scene.add(lightOne);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // this.rotY1 = new Matrix4().makeRotationY(THREE.Math.degToRad(1));

    // Adding the boat.
    this.boat = new Boat();
    this.boat.matrixAutoUpdate = false;
    this.boat.matrix.setPosition(new THREE.Vector3(42, -24, -50));
    this.scene.add(this.boat);

    // this.rotateBoatY = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(5));
    // this.newPositionBoat = new THREE.Matrix4().makeTranslation(20, -22, 30);

    // Adding the placement grid.
    this.placementgrid = new PlacementGrid();
    this.placementgrid.rotateX(Math.PI / 2);
    this.scene.add(this.placementgrid);
    this.placementgrid.position.y = -25;

    // Use real-time to aid boat circuit.
    this.initialMilliseconds = (new Date()).getTime();
    this.cycleTotalMilliseconds = 10000;
    this.currentIteration = 0;

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame((time) => this.render(time));
  }

  render(ts) {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    // Rotates the Boat. Old.
    // this.boat.matrix.multiply (this.rotateBoatY);

    // Positions the Boat. Old.
    // this.boat.matrix.multiply (this.newPositionBoat);

    // Rotates the Propeller
    this.boat.render();

    // Rotates the lighthouse lamp
    // this.lighthouse.render();
    this.lighthouse.lamp.rotateY(THREE.Math.degToRad(1));
    this.lighthouse.lamp.spotlight.target = this.lighthouse.lamp.target;

    // Controlling the position of the boat to a cycle.
    // let newMilliSecondTime = (new Date()).getTime();
    let newMilliSecondTime = ts;
    var timeDifference = newMilliSecondTime - this.initialMilliseconds;
    timeDifference = timeDifference % this.cycleTotalMilliseconds;
    let timePercentage = timeDifference / this.cycleTotalMilliseconds;

    // Use timePercentage as the "S" value in a parametric equation to get
    // new values for X and Y
    // var t = timePercentage * 2 * Math.PI;
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
    // console.log("Test: " + n);
    // console.log("Change: " + (n - this.lastN));

    this.boat.matrix.setPosition(new THREE.Vector3(boatXPosition, -24, boatYPosition));
    this.boat.matrix.multiply(new THREE.Matrix4().makeRotationY(-1 * Math.abs(n - this.lastN) ));
    this.lastN = n;

    // this.ghost.matrix.multiply (this.rotY1);

    requestAnimationFrame((time) => this.render(time));
  }

  keydownHandler(event) {

    var whichRadio = "";
    if (document.getElementById('boat_but').checked == true) {
      whichRadio = "boat";
    } else if (document.getElementById('lighthouse_but').checked == true) {
      whichRadio = "lighthouse";
    }

    var keycode = event.keyCode || event.which;
    switch (keycode) {

      // LEFT
      case 37:
        console.log("LEFT");
        if (whichRadio == "boat") {
          console.log("BOAT");
        } else if (whichRadio == "lighthouse") {
          console.log("LIGHTHOUSE");
        }
        break;

      // RIGHT
      case 39:
        console.log("RIGHT");
        if (whichRadio == "boat") {
          console.log("BOAT");
        } else if (whichRadio == "lighthouse") {
          console.log("LIGHTHOUSE");
        }
        break;

      // UP
      case 38:
        console.log("UP");
        if (whichRadio == "boat") {
          console.log("BOAT");
        } else if (whichRadio == "lighthouse") {
          console.log("LIGHTHOUSE");
        }
        break;

      // DOWN
      case 40:
        console.log("DOWN");
        if (whichRadio == "boat") {
          console.log("BOAT");
        } else if (whichRadio == "lighthouse") {
          console.log("LIGHTHOUSE");
        }
        break;

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

  resizeHandler() {
    const canvas = document.getElementById("mycanvas");
    let w = window.innerWidth - 16;
    let h = 0.75 * w;  /* maintain 4:3 ratio */
    if (canvas.offsetTop + h > window.innerHeight) {
      h = window.innerHeight - canvas.offsetTop - 16;
      w = 4/3 * h;
    }
    canvas.width = w;
    canvas.height = h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.tracker.handleResize();
  }
}
