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

    // //FIXME remove this
    // const marker1 = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 1), new THREE.MeshPhongMaterial({color: 0x0000ff}));
    // marker1.rotateX(Math.PI / 2);
    // marker1.translateY(50);
    // this.scene.add(marker1);
    //
    // //FIXME remove this
    // const marker2 = new THREE.Mesh(new THREE.CylinderGeometry(50, 50, 1), new THREE.MeshPhongMaterial({color: 0x0000ff}));
    // marker2.rotateX(Math.PI / 2);
    // marker2.translateY(-50);
    // this.scene.add(marker2);

    const skyboxGeom = new THREE.SphereGeometry(100, 32, 32);
    const skyboxMatr = new MeshPhongMaterial({color: 0xff00ff, side: THREE.BackSide});
    const skybox = new Mesh(skyboxGeom, skyboxMatr);
    this.scene.add(skybox);

    this.lighthouse = new Lighthouse();
    this.lighthouse.lamp.matrixAutoUpdate = false;
    //FIXME uncomment
    this.scene.add(this.lighthouse);

    this.lightOne = new THREE.DirectionalLight(0xffffff, 1.0);
    this.lightOne.position.set(10, 40, 100);
    this.scene.add(this.lightOne);

    const ambientLight = new THREE.AmbientLight(0x404040);
    this.scene.add(ambientLight);

    // Adding the boat.
    this.boat = new Boat(1);
    this.boat.matrixAutoUpdate = false;
    // this.boat.matrix.setPosition(new THREE.Vector3(42, -24, -50));
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

    //this.addListeners();

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame((time) => this.render(time));
  }

  render(ts) {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

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

    //FIXME uncomment
    this.boat.matrix.setPosition(new THREE.Vector3(boatXPosition, -24, boatYPosition));
    this.boat.matrix.multiply(new THREE.Matrix4().makeRotationY(-1 * Math.abs(n - this.lastN) ));
    this.lastN = n;

    requestAnimationFrame((time) => this.render(time));
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

  addListeners() {
      var directionalToggle = document.getElementById("directionalToggle");
      directionalToggle.addEventListener("change", () => function(name) {
          console.log('troy');
      });
  }

  toggleLight() {
      console.log(this.lightOne.visibile);
  }
}
