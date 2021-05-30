import React from 'react';
import * as THREE from 'three';
import {FlyControls} from 'three/examples/jsm/controls/FlyControls';
import {connect} from 'react-redux';
import {gotoObj, goBack, setCamPos, setActiveCam} from '../../actions';
import Stats from 'three/examples/jsm/libs/stats.module';

import Cam from '../../three/threeCam';
import {objLoader} from '../../three/threeLoaders';
import {animQueue, addAnim, popAnim} from '../../three/threeAnim';
import BackBtn from '../Back';

class Scene extends React.Component {
    state = {camera: {}}

    onWinResize(renderer, cam) {
        cam.aspect = window.innerWidth /window.innerHeight;
        cam.updateProjectionMatrix();

        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    onMouseClick(event, mouse, scene, camera, raycaster) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera.perspCam);
        var intersects = raycaster.intersectObjects(scene.children, true);
        if(intersects.length > 0) {
            if(intersects[0].object.parent !== undefined && 
                this.props.scene.camPos[intersects[0].object.parent.name] !== undefined) {
                const pos = this.props.scene.camPos[intersects[0].object.parent.name];
                if(animQueue["moveCam"]) {
                    popAnim("moveCam");
                    camera.lerpAlpha = 0;
                }
                addAnim("moveCam", (delta) => {
                    if(camera.moveToTarget(pos, 0.4 * delta)) {
                        popAnim("moveCam");
                    }
                });
                this.props.gotoObj();
            }
        }
    }

    componentDidMount() {
        
        var scene = new THREE.Scene(); // Creates the scene to hold all 3D objects
        
        var camera = new Cam(); //Creates a camera to view the scene
        var newPos = {'initPos': camera.perspCam.position.clone()};
        this.props.goBack();
        this.props.setActiveCam(camera);
        this.setState({camera: camera}); //Just to allow the back button to move the camera

        var renderer = new THREE.WebGLRenderer(); // The WebGL rendering "engine"
        renderer.setSize(window.innerWidth, window.innerHeight); // Resizes the canvas created by the renderer
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
        this.mount.appendChild(renderer.domElement); // appends the canvas (domElement) to the <div> the Scene component is mounted to
        window.addEventListener('resize', (e) => {
            this.onWinResize(renderer, camera.perspCam)
        });

        var raycaster = new THREE.Raycaster();
        var mouse = new THREE.Vector2();
        
        window.addEventListener('click', (e) => {
            this.onMouseClick(e, mouse, scene, camera, raycaster, this.props);
        })

        objLoader('/models/bg-wall.obj', ['/textures/brick-wall.png'], [THREE.RepeatWrapping], [new THREE.MeshStandardMaterial()], (object) => {
            scene.add(object);
            object.receiveShadow = true;
            object.translateZ(-40);
        });
        objLoader('/models/bg-floor.obj', ['/textures/wooden-floor.png'], [THREE.MirroredRepeatWrapping], [new THREE.MeshStandardMaterial()], (object) => {
            scene.add(object);
            object.children[0].receiveShadow = true;
            object.translateY(-10);
        });
        objLoader('/models/desk.obj', 
        [0xCCCCCC, '/textures/desk.png', 0xCCCCCC, 0xCCCCCC, 0xCCCCCC, 0xCCCCCC, 0xCCCCCC, 0xCCCCCC, 0xCCCCCC], 
        [undefined, THREE.MirroredRepeatWrapping, undefined, undefined, undefined, undefined, undefined, undefined, undefined],  
        [new THREE.MeshStandardMaterial(), new THREE.MeshLambertMaterial(), new THREE.MeshStandardMaterial(), 
            new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial(), 
            new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial()], 
        (object) => {
            scene.add(object);
            object.children[1].castShadow = true;
            object.translateZ(-35);
            object.translateY(-6.5);
        });

        //NOTE(Kristian): Only used to verify that it is possible to move to multiple objects
        objLoader('/models/trophy.obj', [0xff0000], [THREE.RepeatWrapping], [new THREE.MeshStandardMaterial()], (object) => {
            scene.add(object);
            object.translateX(-1);
            object.translateZ(-10);
            const camPos = new THREE.Vector3(object.position.x, object.position.y, object.position.z + 2);
            const key = object.name = "trophy";
            newPos = Object.assign({}, newPos, {[key]: camPos})
        });

        objLoader('/models/cardboard.obj', 
        ['/textures/cardboard.png', 0xCCCCCC, 0xCCCCCC, 0xCCCCCC, 0xCCCCCC], 
        [THREE.RepeatWrapping, undefined, undefined, undefined, undefined], 
        [new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial(), new THREE.MeshStandardMaterial()], 
        (object) => {
            console.log(object);
            scene.add(object);
            object.translateZ(-38);
            object.translateY(4);
            const camPos = new THREE.Vector3(object.position.x, object.position.y, object.position.z + 20);
                const key = object.name = "cardboard";
                newPos = Object.assign({}, newPos, {[key]: camPos})
                this.props.setCamPos(newPos); //NB!!! MUST BE CALLED WHEN THE LAST ENTRY TO THE camPos STATE HAS BEEN ADDED
        });

        const pointLight = new THREE.PointLight(0xF9F3A8, 0.3);
        pointLight.position.set(4, -1, -37);
        pointLight.castShadow = true;
        pointLight.shadow.mapSize.width = 512; // default
        pointLight.shadow.mapSize.height = 512; // default
        pointLight.shadow.camera.near = 0.5; // default
        pointLight.shadow.camera.far = 500; // default
        scene.add(pointLight);
        const light = new THREE.HemisphereLight(0xffffbb, 0x080820, 0.5) // Creates a light to light up the scene
        scene.add(light); // Adds the light to the scene
        
        //Create a helper for the shadow camera (optional)
        const helper = new THREE.CameraHelper( pointLight.shadow.camera );
        scene.add( helper );

        //NOTE(kristian): Only for debugging purposes, comment out for release
        let controls = new FlyControls( camera.perspCam, renderer.domElement );
        controls.movementSpeed = 10;
        controls.domElement = renderer.domElement;
        controls.rollSpeed = Math.PI / 24;
        controls.autoForward = false;
        controls.dragToLook = true;


        const clock = new THREE.Clock();
        const stats = Stats()
        document.body.appendChild(stats.dom)


        var animate = function () {
            requestAnimationFrame(animate);

            //controls.update(clock.getDelta());
            stats.update();
            for(let key in animQueue) {
                animQueue[key](clock.getDelta());
            }
            renderer.render(scene, camera.perspCam);
        };
        animate();
    }

    render() {
        return (
            <div>
                {(this.props.scene.renderBck) ? <BackBtn camera={this.state.camera} /> : <div />}
                <div ref={ref => (this.mount = ref)} />
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {scene: state.scene};
}
export default connect(mapStateToProps, {gotoObj, goBack, setCamPos, setActiveCam})(Scene);