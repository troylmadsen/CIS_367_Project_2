import { Group, Mesh, MeshPhongMaterial, BoxGeometry } from 'three';

export default class Boat extends Group {
    constructor () {
        super()

        // Setting Size Variables
        var height = 5;
        var width = 5;
        var depth = 5;
        var scaling = 1;
        height = height * scaling;
        width = width * scaling;
        depth = depth * scaling;

        // Initial Boat Shaping
        var geometry = new BoxGeometry( height, width, depth );
        var material = new MeshPhongMaterial( {color: 0x00ff00} );
        var cube = new Mesh( geometry, material );
        this.add( cube );

    }
}
