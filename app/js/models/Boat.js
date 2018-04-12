import { Group, Mesh, MeshPhongMaterial, BoxGeometry } from 'three';
import * as THREE from "three";

export default class Boat extends Group {

    constructor () {
        super()

        // Setting Size Variables
        var height = 0.8;
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

        // Adding the Propeller
        var geometry = new BoxGeometry( 6, 1.5, .6);
        var material = new MeshPhongMaterial( {color: 0xEE6666} );
        this.propeller = new Mesh( geometry, material );
        this.propeller.translateY(-.5);
        this.propeller.translateZ((-5 - 0.3));
        this.add( this.propeller );
    }

    render() {
        // Rotates the propeller
        this.propeller.rotateZ(.7);
    }
}
