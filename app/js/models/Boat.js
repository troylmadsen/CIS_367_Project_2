import { Group, Mesh, MeshPhongMaterial, BoxGeometry } from 'three';
import * as THREE from "three";

export default class Boat extends Group {

    constructor () {
        super()

        // Setting Size Variables
        var height = 1.3;
        var width = 4;
        var depth = 10;
        var scaling = 1;
        height = height * scaling;
        width = width * scaling;
        depth = depth * scaling;

        // Initial Boat Shaping
        var geometry = new BoxGeometry( width, height, depth );
        var material = new MeshPhongMaterial( {color: 0x999999} );
        var cube = new Mesh( geometry, material );
        this.add( cube );

        var geometry = new BoxGeometry( 3, 2, 2 );
        var material = new MeshPhongMaterial( {color: 0x991111} );
        this.propeller = new Mesh( geometry, material );
        this.propeller.translateY(3);
        this.add( this.propeller );

      // Boat Propeller Matrix Transform
      this.rotatePropellerX = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(10));

    }

    render() {
        // Rotates the propeller
        this.propeller.rotateZ(.3);
    }
}
