import * as THREE from 'three';
// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Ghost from './models/Ghost';
import Lighthouse from './models/Lighthouse';
import Boat from './models/Boat';
import PlacementGrid from './models/PlacementGrid';
import Mailbox from './models/Mailbox';

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

    // this.ghost = new Ghost(0x505050);
    // this.ghost.matrixAutoUpdate = false;
    // this.scene.add(this.ghost);

    this.lighthouse = new Lighthouse();
    this.scene.add(this.lighthouse);

    const lightOne = new THREE.DirectionalLight(0xffffff, 1.0);
    lightOne.position.set(10, 40, 100);
    this.scene.add(lightOne);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    this.rotY1 = new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(1));

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
    requestAnimationFrame(() => this.render());
  }

  render() {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    // Rotates the Boat. Old.
    // this.boat.matrix.multiply (this.rotateBoatY);

    // Positions the Boat. Old.
    // this.boat.matrix.multiply (this.newPositionBoat);

    // Rotates the Propeller
    this.boat.render();

    // Controlling the position of the boat to a cycle.
    let newMilliSecondTime = (new Date()).getTime();
    var timeDifference = newMilliSecondTime - this.initialMilliseconds;
    timeDifference = timeDifference % this.cycleTotalMilliseconds;
    let timePercentage = timeDifference / this.cycleTotalMilliseconds;

    // Use timePercentage as the "S" value in a parametric equation to get
    // new values for X and Y
    // var t = timePercentage * 2 * Math.PI;
    var t = timePercentage * 2 * Math.PI;
    var boatXPosition = 52 * Math.cos(t);
    var boatYPosition = 15 * Math.sin(t);

    // First derivative - The direction of the boat.
      // dx/dt = 52 * -sin(t)
      // dy/dt = 25 * cos(t)
    var secondLine = new THREE.Vector3( (-52 * Math.sin(t)), (15 * Math.cos(t)), 0);
    var xLine = new THREE.Vector3(1, 0, 0);
    var n = xLine.angleTo(secondLine);
    if (this.lastN === undefined || this.lastN === null) {
      this.lastN = n;
      this.boat.matrix.multiply(new THREE.Matrix4().makeRotationY(THREE.Math.degToRad(-15) ));
    }
    // console.log("Test: " + n);
    // console.log("Change: " + (n - this.lastN));

    this.boat.matrix.setPosition(new THREE.Vector3(boatXPosition, -24, boatYPosition));
    this.boat.matrix.multiply(new THREE.Matrix4().makeRotationY(-1 * Math.abs(n - this.lastN) ));
    this.lastN = n;

    // this.ghost.matrix.multiply (this.rotY1);

    requestAnimationFrame(() => this.render());
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
