import {BoxGeometry, CylinderGeometry, Group, Mesh, MeshPhongMaterial} from 'three';

export default class PlacementGrid extends Group {
    constructor () {
        super()

        // Setting Size Variables
        var width = 0.2;
        var depth = 0.2;
        var numLines = 20;
        var initialStart = 0 - Math.floor(numLines / 2);
        var endLine = initialStart + numLines;

        // Spacing Between the Bars
        var xDisplacement = 5;
        var yDisplacement = xDisplacement;

        var height = (numLines * xDisplacement);

        // Setting the Grid
        var geometry = new BoxGeometry( height, width, depth );
        var material = new MeshPhongMaterial( {color: 0x0000ff} );

        // Create Many Y-Gridlines
        for (var i = initialStart; i <= endLine; i++) {
            var cube = new Mesh( geometry, material );
            cube.translateY(yDisplacement * i );
            this.add( cube );
        }

        // Create Many X-Gridlines
        var material = new MeshPhongMaterial( {color: 0xff0000} );
        for (var j = initialStart; j <= endLine; j++) {
            var cube = new Mesh( geometry, material );
            cube.rotateZ(Math.PI / 2);
            cube.translateY(xDisplacement * j );
            this.add( cube );
        }
    }
}
