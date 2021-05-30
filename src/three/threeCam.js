import * as THREE from 'three';

export default class ThreeCam {
    constructor(){
        const aspectRatio = window.innerWidth/window.innerHeight; // The scene aspect ratio
        this.perspCam = new THREE.PerspectiveCamera(45,  // The Field-of-View
            aspectRatio, 
            0.1,   // The near value (frustum "back")
            1000); // The far value (frustum "front")
        this.perspCam.position.z = 2; // Just repositions the camera a bit
        this.lerpAlpha = 0;
    }

    setCamPos(pos) {
        this.perspCam.position.x = pos.x;
        this.perspCam.position.y = pos.y;
        this.perspCam.position.z = pos.z;
    }

    moveCam(dir, speed) {
        this.perspCam.position.x += (dir.x * speed);
        this.perspCam.position.y += (dir.y * speed);
        this.perspCam.position.z += (dir.z * speed);
    }

    moveToTarget(targetPos, speed) {
        const camPos = this.perspCam.position;
        this.lerpAlpha += speed;
        if(this.lerpAlpha < 1) {
            camPos.lerp(targetPos, this.lerpAlpha);
        } else {
            this.lerpAlpha = 0;
            return true;
        }
    }
}