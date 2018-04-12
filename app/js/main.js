import * as THREE from 'three';
// import orbit from 'three-orbit-controls';
// const OrbitControls = orbit(THREE);
import TrackballControls from 'three-trackballcontrols';
import Ghost from './models/Ghost';
import Lighthouse from './models/Lighthouse';
import Mailbox from './models/Mailbox';

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

    //FIXME replace this with boat
    this.boat_deg = 0;
    this.deg_change_rate = 2 * Math.PI / 2000;

    var boatGeom = new BoxGeometry(5, 5, 10);
    var boatMatr = new MeshPhongMaterial({color: 0x00ff00});
    this.boat = new Mesh(boatGeom, boatMatr);
    this.boat.matrixAutoUpdate = false;
    var offset = new Matrix4().makeTranslation(0, 0, 20);
    this.boat.matrix.multiply(offset);
    this.scene.add(this.boat);
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

    // this.rotY1 = new Matrix4().makeRotationY(THREE.Math.degToRad(1));

    window.addEventListener('resize', () => this.resizeHandler());
    this.resizeHandler();
    requestAnimationFrame((time) => this.render(time));
  }

  render(ts) {
    this.renderer.render(this.scene, this.camera);
    this.tracker.update();

    // FIXME Boat angle changing
    // this.boat_deg += this.deg_change_rate;
    // if (this.boat_deg > 2 * Math.PI) {
    //     this.boat_deg = 0;
    // }

    // var bot_rot = new Matrix4().makeRotationX(Math.cos());
    // this.boat.matrix.multiply(bot_rot);

    var move = new Matrix4().makeTranslation(0, Math.sin(ts/500) / 4, 0);
    var rot = new Matrix4().makeRotationX(Math.cos(ts/500));
    console.log(THREE.Math.radToDeg(Math.cos(ts/500)));
    // this.boat.matrix.multiply(move);
    this.boat.matrix.multiply(rot);

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
}
