import { CylinderGeometry, DoubleSide, Group, Mesh, MeshPhongMaterial } from 'three';
// import * as THREE from "three";

export default class Propeller extends Group {

    constructor (scale, numBlades) {
        super()

        var BLADE_RADIUS = 1 * scale;
        for (var i = 0; i < numBlades; i++) {
            var bladeGeom = new CylinderGeometry(BLADE_RADIUS, BLADE_RADIUS, 0.1, 32, 1, false, 0, Math.PI);
            var bladeMatr = new MeshPhongMaterial({
                // ambient: 0x313131, // ambient is (0.192250, 0.192250, 0.192250)
                color: 0x0f0f0f, // diffuse
                specular: 0x828282, // specular is (0.508273, 0.508273, 0.508273)
                shininess: 51.200001,
                side: DoubleSide
            });
            var blade = new Mesh(bladeGeom, bladeMatr);
            blade.rotateX(Math.PI / 2);
            blade.rotateY(i * 2 * Math.PI / numBlades);
            blade.translateZ(BLADE_RADIUS);
            this.add(blade);
        }

        this.ROD_RADIUS = BLADE_RADIUS / 4;
        this.ROD_LENGTH = this.ROD_RADIUS * 4;
        var rodGeom = new CylinderGeometry(this.ROD_RADIUS, this.ROD_RADIUS, this.ROD_LENGTH, 32);
        var rodMatr = new MeshPhongMaterial({
            // ambient: 0x313131, // ambient is (0.192250, 0.192250, 0.192250)
            color: 0xf0f0f0, // diffuse
            specular: 0x828282, // specular is (0.508273, 0.508273, 0.508273)
            shininess: 51.200001,
            side: DoubleSide
        });
        var rod = new Mesh(rodGeom, rodMatr);
        rod.rotateX(Math.PI / 2);
        this.add(rod);
    }
}
