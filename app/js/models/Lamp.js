import { CylinderGeometry, DoubleSide, Group, LatheGeometry, Matrix4, Mesh, MeshPhongMaterial, SpotLight, SpotLightHelper, Vector2 } from 'three';
import * as THREE from 'three';

export default class Lamp extends Group {
    constructor (scale) {
        super()

        this.lampRot = new Matrix4().makeRotationY(THREE.Math.degToRad(1));

        const STAND_SCALE = 0.25;
        this.STAND_HEIGHT = 4 * STAND_SCALE * scale;
        this.STAND_SIZE = 2 * STAND_SCALE * scale;
        const standGeom = new CylinderGeometry(this.STAND_SIZE, this.STAND_SIZE, this.STAND_HEIGHT, 32);
        const standMatr = new MeshPhongMaterial({color: 0x909090});
        const stand = new Mesh(standGeom, standMatr);
        stand.translateY(-1 * 1.45 * this.STAND_HEIGHT);
        // stand.translateZ(0.8 * this.STAND_SIZE);
        this.add(stand);

        const FOCUS_SCALE = 0.085;
        var points = [];
        for (var i = 0; i < 10; i++) {
            points.push( new Vector2( (Math.sin(i * 0.19) * 12 + 1) * FOCUS_SCALE * scale, ((i - 5) * 1.5) * FOCUS_SCALE * scale) );
        }
        const focusGeom = new LatheGeometry(points);
        // DoubleSide allows for rendering the inside and outside object
        // https://stackoverflow.com/questions/10287186/is-there-a-backface-visibility-equivalent-for-three-js
        const focusMatr = new MeshPhongMaterial({color: 0x909090, side: DoubleSide});
        this.focus = new Mesh(focusGeom, focusMatr);
        this.focus.rotateX(Math.PI / 2);
        this.focus.translateY(-1 * 0.8 * this.STAND_SIZE);
        this.add(this.focus);

        const targetGeom = new CylinderGeometry(0, 0, 0, 0);
        const targetMatr = new MeshPhongMaterial();
        this.target = new Mesh(targetGeom, targetMatr);
        this.add(this.target);

        this.spotlight = new SpotLight(0xffffff, 1.0, 200, Math.PI / 12, 0.15, 1);
        this.spotlight.position.set(0, 0.13 * this.STAND_HEIGHT, -1 * 1 * this.STAND_SIZE);
        // this.add(new SpotLightHelper(this.spotlight));
        this.add(this.spotlight);
    }

    render() {
        this.spotlight.target = this.target;
    }
}
