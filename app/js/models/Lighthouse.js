import { ConeGeometry, CylinderGeometry, Group, ImageUtils, Mesh, MeshPhongMaterial, SphereGeometry } from 'three';
import Lamp from './Lamp.js';

export default class Lighthouse extends Group {
    constructor () {
        super()

        //FIXME remove this
        // const marker = new Mesh(new CylinderGeometry(50, 50, 1), new MeshPhongMaterial({color: 0x0000ff}));
        // this.add(marker);

        var NUM_SIDES = 6;
        var LIGHTHOUSE_TOP = 14;
        var LIGHTHOUSE_BOT = 20;
        var LIGHTHOUSE_HEIGHT = 100;
        const bodyGeom = new CylinderGeometry(LIGHTHOUSE_TOP, LIGHTHOUSE_BOT, LIGHTHOUSE_HEIGHT, NUM_SIDES);
        const bodyTex = ImageUtils.loadTexture('../textures/Brick-4096.jpg');
        const bodyMatr = new MeshPhongMaterial({color: 0xffffff, map: bodyTex});
        const body = new Mesh(bodyGeom, bodyMatr);
        this.add(body);

        var DECK_TOP = LIGHTHOUSE_BOT * 1.1;
        var DECK_BOT = LIGHTHOUSE_TOP;
        var DECK_HEIGHT = LIGHTHOUSE_HEIGHT / 20;
        const deckGeom = new CylinderGeometry(DECK_TOP, DECK_BOT, DECK_HEIGHT, NUM_SIDES);
        const deckMatr = new MeshPhongMaterial({color: 0xffffff});
        const deck = new Mesh(deckGeom, deckMatr);
        deck.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT / 2);
        this.add(deck);

        var PEDESTAL_HEIGHT = LIGHTHOUSE_HEIGHT / 15;
        const pedestalGeom = new CylinderGeometry(LIGHTHOUSE_TOP, LIGHTHOUSE_TOP, PEDESTAL_HEIGHT, NUM_SIDES);
        const pedestalMatr = new MeshPhongMaterial({color: 0xff0000});
        const pedestal = new Mesh(pedestalGeom, pedestalMatr);
        pedestal.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT / 2);
        this.add(pedestal);

        var NUM_SUPPORTS = 6;
        var SUPPORT_SIZE = LIGHTHOUSE_TOP / 20;
        var SUPPORT_HEIGHT = LIGHTHOUSE_HEIGHT / 8;
        for (var i = 0; i < NUM_SUPPORTS; i++) {
            var supportGeom = new CylinderGeometry(SUPPORT_SIZE, SUPPORT_SIZE, SUPPORT_HEIGHT, 4);
            var supportMatr = new MeshPhongMaterial({color: 0xff0000});
            var support = new Mesh(supportGeom, supportMatr);
            support.rotateY(i * 2 * Math.PI / NUM_SUPPORTS);
            support.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT + SUPPORT_HEIGHT / 2);
            support.translateZ(LIGHTHOUSE_TOP - SUPPORT_SIZE);
            this.add(support);
        }

        var ROOF_BOT = LIGHTHOUSE_TOP * 1.2;
        var ROOF_HEIGHT = LIGHTHOUSE_HEIGHT / 6;
        const roofGeom = new ConeGeometry(ROOF_BOT, ROOF_HEIGHT, NUM_SIDES);
        const roofMatr = new MeshPhongMaterial({color: 0xff0000});
        const roof = new Mesh(roofGeom, roofMatr);
        roof.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT + SUPPORT_HEIGHT + ROOF_HEIGHT / 2);
        this.add(roof);

        this.lamp = new Lamp(4);
        this.lamp.translateY(LIGHTHOUSE_HEIGHT / 2 + DECK_HEIGHT + PEDESTAL_HEIGHT + this.lamp.STAND_HEIGHT / 2);
        this.lamp.translateY(LIGHTHOUSE_HEIGHT / 18);
        this.add(this.lamp);
    }

    render() {
        this.lamp.rotateY(0.005);
    }
}
