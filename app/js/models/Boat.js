import { ConeGeometry, CylinderGeometry, DoubleSide, Group, ImageUtils, Matrix4, Mesh, MeshPhongMaterial, SphereGeometry } from 'three';
import * as THREE from "three";
import Propeller from './propeller.js';

export default class Boat extends Group {

    constructor (scale) {
        super()

        var BODY_LENGTH = 10 * scale;
        var BODY_RADIUS = 3 * scale;
        const bodyGeom = new CylinderGeometry(BODY_RADIUS, BODY_RADIUS, BODY_LENGTH, 32, 1, true, Math.PI / 2, Math.PI);
        const bodyMatr = new MeshPhongMaterial({
            ambient: 0x313131, // ambient is (0.192250, 0.192250, 0.192250)
            color: 0x818181, // diffuse is (0.507540, 0.507540, 0.507540)
            specular: 0x828282, // specular is (0.508273, 0.508273, 0.508273)
            shininess: 51.200001,
            side: DoubleSide
        });
        const body = new Mesh(bodyGeom, bodyMatr);
        body.rotateX(-1 * Math.PI / 2);
        body.translateZ(BODY_RADIUS);
        this.add(body);

        var NOSE_LENGTH = 2 * BODY_LENGTH / 5;
        const noseGeom = new ConeGeometry(BODY_RADIUS, NOSE_LENGTH, 32, 1, true, 3 * Math.PI / 2, Math.PI);
        const noseMatr = new MeshPhongMaterial({
            ambient: 0x313131, // ambient is (0.192250, 0.192250, 0.192250)
            color: 0x818181, // diffuse is (0.507540, 0.507540, 0.507540)
            specular: 0x828282, // specular is (0.508273, 0.508273, 0.508273)
            shininess: 51.200001,
            side: DoubleSide
        });
        const nose = new Mesh(noseGeom, noseMatr);
        nose.rotateX(Math.PI / 2);
        nose.translateZ(-1 * BODY_RADIUS);
        nose.translateY(BODY_LENGTH / 2 + NOSE_LENGTH / 2);
        this.add(nose);

        var BACK_LENGTH = 0.1;
        const backGeom = new CylinderGeometry(BODY_RADIUS, BODY_RADIUS, BACK_LENGTH, 32, 1, false, Math.PI / 2, Math.PI);
        const backMatr = new MeshPhongMaterial({
            ambient: 0x313131, // ambient is (0.192250, 0.192250, 0.192250)
            color: 0x818181, // diffuse is (0.507540, 0.507540, 0.507540)
            specular: 0x828282, // specular is (0.508273, 0.508273, 0.508273)
            shininess: 51.200001,
            side: DoubleSide
        });
        const back = new Mesh(backGeom, backMatr);
        back.rotateX(-1 * Math.PI / 2);
        back.translateZ(BODY_RADIUS);
        back.translateY(BODY_LENGTH / 2);
        this.add(back);

        // this.translateY(BODY_RADIUS / 2);

        this.prop = new Propeller(1, 3);
        this.prop.matrixAutoUpdate = false;
        this.prop.applyMatrix(new Matrix4().makeTranslation(0, this.prop.ROD_RADIUS, 0));
        this.prop.applyMatrix(new Matrix4().makeTranslation(0, 0, -1 * BODY_LENGTH / 2 - this.prop.ROD_LENGTH / 2));
        // this.prop.translateY(this.prop.ROD_RADIUS);
        // this.prop.translateZ(-1 * BODY_LENGTH / 2 - this.prop.ROD_LENGTH / 2);
        this.add(this.prop);

        var propRotRad = THREE.Math.degToRad(3);
        this.propRot = new THREE.Matrix4().makeRotationZ(propRotRad);
    }

    render() {
        // Rotates the propeller
        // this.prop.applyMatrix(this.propRot);
        this.prop.matrix.multiply(this.propRot);
        this.prop.render();
    }
}
