import { CylinderGeometry, Group, Mesh, MeshPhongMaterial, SphereGeometry } from 'three';

export default class Lighthouse extends Group {
    constructor () {
        super()

        var LIGHTHOUSE_TOP = 7;
        var LIGHTHOUSE_BOT = 10;
        var LIGHTHOUSE_HEIGHT = 50;

        const bodyGeom = new CylinderGeometry(LIGHTHOUSE_TOP, LIGHTHOUSE_BOT, LIGHTHOUSE_HEIGHT, 32);
        const bodyMatr = new MeshPhongMaterial({color: 0xffffff});
        const body = new Mesh(bodyGeom, bodyMatr);
        this.add(body);

        var SUPPORT_SIZE = LIGHTHOUSE_TOP / 7;
        var SUPPORT_HEIGHT = LIGHTHOUSE_HEIGHT / 8;
        for (var i = 0; i < 4; i++) {
            var supportGeom = new CylinderGeometry(SUPPORT_SIZE, SUPPORT_SIZE, SUPPORT_HEIGHT, 4);
            var supportMatr = new MeshPhongMaterial({color: 0xff0000});
            var support = new Mesh(supportGeom, supportMatr);
            support.rotateY(i * Math.PI / 2);
            support.translateY(LIGHTHOUSE_HEIGHT / 2 + SUPPORT_HEIGHT / 2);
            support.translateZ(LIGHTHOUSE_TOP - SUPPORT_SIZE);
            this.add(support);
        }

         
    }
}
