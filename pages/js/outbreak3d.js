import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';
import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';


//render
const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
//scene
const scene = new THREE.Scene();
//camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );
//camera orbit controls
const controls = new OrbitControls( camera, renderer.domElement );
//lights
const light = new THREE.PointLight();
light.position.set( 0, 200, 0 );
scene.add( light );

//skybox
const cubeLoader = new THREE.CubeTextureLoader();
    const texture = cubeLoader.load([
        './resources/skybox/left.jpg',
        './resources/skybox/right.jpg',
        './resources/skybox/top.jpg',
        './resources/skybox/bottom.jpg',
        './resources/skybox/back.jpg',
        './resources/skybox/front.jpg',
    ]);
texture.encoding = THREE.sRGBEncoding;
scene.background = texture;

//player model
const loader = new FBXLoader();
loader.setPath('./resources/player/');
loader.load('swat.fbx', (fbx) => {

    const target = fbx;
    scene.add(target);
  }, undefined, function ( error ) {

	console.error( error );
});

//controls.update() must be called after any manual changes to the camera's transform
controls.update();
camera.position.set( 0, 220, 320 );
camera.rotation.x -= 0.1;

function animate() {

	requestAnimationFrame( animate );

	// required if controls.enableDamping or controls.autoRotate are set to true
	//controls.update();
    //camera.rotation.x += 9;

	renderer.render( scene, camera );

}

animate();