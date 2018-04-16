import { ConeGeometry, CylinderGeometry, Group, ImageUtils, Matrix4, Mesh, MeshPhongMaterial, TextureLoader } from 'three';
import * as THREE from 'three';
import Lamp from './Lamp.js';
import brick1 from "../../../textures/Brick-4096.jpg";
import brick2 from "../../../textures/dark_brick-4096x1024.jpg";
import wood from "../../../textures/wood-2048x2048.jpg";

export default class Lighthouse extends Group {
    constructor () {
        super()

        var NUM_SIDES = 6;
        var LIGHTHOUSE_TOP = 14;
        var LIGHTHOUSE_BOT = 20;
        var LIGHTHOUSE_HEIGHT = 100;
        const bodyGeom = new CylinderGeometry(LIGHTHOUSE_TOP, LIGHTHOUSE_BOT, LIGHTHOUSE_HEIGHT, NUM_SIDES);
        const bodyTex = new TextureLoader().load(brick1);
        const bodyMatr = new MeshPhongMaterial({color: 0xffffff, map: bodyTex});
        const body = new Mesh(bodyGeom, bodyMatr);
        this.add(body);

        var DECK_TOP = LIGHTHOUSE_BOT * 1.1;
        var DECK_BOT = LIGHTHOUSE_TOP;
        var DECK_HEIGHT = LIGHTHOUSE_HEIGHT / 20;
        const deckGeom = new CylinderGeometry(DECK_TOP, DECK_BOT, DECK_HEIGHT, NUM_SIDES);
        const deckTex = new TextureLoader().load(brick2);
        const deckMatr = new MeshPhongMaterial({color: 0xffffff, map: deckTex});
        const deck = new Mesh(deckGeom, deckMatr);
        deck.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT / 2);
        this.add(deck);

        var PEDESTAL_HEIGHT = LIGHTHOUSE_HEIGHT / 15;
        const pedestalGeom = new CylinderGeometry(LIGHTHOUSE_TOP, LIGHTHOUSE_TOP, PEDESTAL_HEIGHT, NUM_SIDES);
        const pedestalTex = new TextureLoader().load(wood);
        const pedestalMatr = new MeshPhongMaterial({color: 0xffffff, map: pedestalTex});
        const pedestal = new Mesh(pedestalGeom, pedestalMatr);
        pedestal.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT / 2);
        this.add(pedestal);

        var NUM_SUPPORTS = 6;
        var SUPPORT_SIZE = LIGHTHOUSE_TOP / 20;
        var SUPPORT_HEIGHT = LIGHTHOUSE_HEIGHT / 8;
        for (var i = 0; i < NUM_SUPPORTS; i++) {
            var supportGeom = new CylinderGeometry(SUPPORT_SIZE, SUPPORT_SIZE, SUPPORT_HEIGHT, 4);
            var supportTex = new TextureLoader().load(wood);
            var supportMatr = new MeshPhongMaterial({color: 0xffffff, map: supportTex});
            var support = new Mesh(supportGeom, supportMatr);
            support.rotateY(i * 2 * Math.PI / NUM_SUPPORTS);
            support.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT + SUPPORT_HEIGHT / 2);
            support.translateZ(LIGHTHOUSE_TOP - SUPPORT_SIZE);
            this.add(support);
        }

        var ROOF_BOT = LIGHTHOUSE_TOP * 1.2;
        var ROOF_HEIGHT = LIGHTHOUSE_HEIGHT / 6;
        const roofGeom = new ConeGeometry(ROOF_BOT, ROOF_HEIGHT, NUM_SIDES);
        const roofTex = new TextureLoader().load(wood);
        const roofMatr = new MeshPhongMaterial({color: 0xffffff, map: roofTex});
        const roof = new Mesh(roofGeom, roofMatr);
        roof.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT + SUPPORT_HEIGHT + ROOF_HEIGHT / 2);
        this.add(roof);

        this.lamp = new Lamp(4);
        this.lamp.matrixAutoUpdate = false;
        const trans = new Matrix4().makeTranslation(0, LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT + this.lamp.STAND_HEIGHT / 2 + LIGHTHOUSE_HEIGHT / 18, 0);
        this.lamp.matrix.multiply(trans);
        this.add(this.lamp);

        var lampRotRad = THREE.Math.degToRad(1);
        this.lampRot = new THREE.Matrix4().makeRotationY(lampRotRad);
    }

    render() {
        this.lamp.applyMatrix(this.lampRot);
        this.lamp.render();
    }
}
