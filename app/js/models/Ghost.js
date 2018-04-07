import { ConeGeometry, CylinderGeometry, Group, Mesh, MeshPhongMaterial, SphereGeometry } from 'three';

export default class Ghost {
    constructor (color) { // color of the ghost
        const BODY_HEIGHT = 30;
        const BODY_RADII = 20;
        const NUM_TAILS = 8;
        const TAIL_HEIGHT = 10;

        const headGeom = new SphereGeometry (BODY_RADII, 32, 32);
        const headMatr = new MeshPhongMaterial ({color: color});
        const head = new Mesh (headGeom, headMatr);

        const bodyGeom = new CylinderGeometry (BODY_RADII, BODY_RADII, BODY_HEIGHT, 32, 10);
        const bodyMatr = new MeshPhongMaterial ({color: color});
        const body = new Mesh (bodyGeom, bodyMatr);
        body.translateY (-0.5 * BODY_HEIGHT);

        const leftEyeGeom = new SphereGeometry (BODY_RADII / 4, 32, 32);
        const leftEyeMatr = new MeshPhongMaterial({color: 0xffffff});
        const leftEye = new Mesh (leftEyeGeom, leftEyeMatr);
        leftEye.rotateY (Math.PI / 8);
        leftEye.translateZ (BODY_RADII);

        const leftPupilGeom = new SphereGeometry (BODY_RADII / 6, 32, 32);
        const leftPupilMatr = new MeshPhongMaterial ({color: 0x000000});
        const leftPupil = new Mesh (leftPupilGeom, leftPupilMatr);
        leftPupil.rotateY (Math.PI / 8);
        leftPupil.translateZ (BODY_RADII + BODY_RADII / 8);

        const rightEyeGeom = new SphereGeometry (BODY_RADII / 4, 32, 32);
        const rightEyeMatr = new MeshPhongMaterial({color: 0xffffff});
        const rightEye = new Mesh (rightEyeGeom, rightEyeMatr);
        rightEye.rotateY (-1 * Math.PI / 8);
        rightEye.translateZ (BODY_RADII);

        const rightPupilGeom = new SphereGeometry (BODY_RADII / 6, 32, 32);
        const rightPupilMatr = new MeshPhongMaterial ({color: 0x000000});
        const rightPupil = new Mesh (rightPupilGeom, rightPupilMatr);
        rightPupil.rotateY (-1 * Math.PI / 8);
        rightPupil.translateZ (BODY_RADII + BODY_RADII / 8);

        const ghostGroup = new Group();
        ghostGroup.add(head, body, leftEye, leftPupil, rightEye, rightPupil);

        for (let i = 0; i < NUM_TAILS; i++) {
            const tailGeom = new ConeGeometry (BODY_RADII / 4, TAIL_HEIGHT, 32);
            const tailMatr = new MeshPhongMaterial ({color: color});
            const tail = new Mesh (tailGeom, tailMatr);
            tail.rotateZ (Math.PI);
            tail.rotateY (i * 2 * Math.PI / NUM_TAILS);
            tail.translateY (BODY_HEIGHT + TAIL_HEIGHT / 2);
            tail.translateZ (BODY_RADII - BODY_RADII / 4);
            ghostGroup.add(tail);
        }

        ghostGroup.rotateY (Math.PI / 4);

        return ghostGroup;
    }
}
