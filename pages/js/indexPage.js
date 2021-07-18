import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//colors
const blue = 0x4a03fc;
const red = 0xfc0303;
const yellow = 0xcd703;
const white = 0x4d4d4;
const orange = 0xff9500;
const green = 0x0ed10a;
const cyan = 0x05e3be;
const colors = [blue, red, yellow, white, orange, green, cyan];

//lights
const light = new THREE.PointLight();
light.position.set( 200, 100, 150 );
scene.add( light );

//space objects
const cubeArray = [];
const sphereArray = []; 
const coneArray = [];
for (let i = 0; i < 500; i++){
    addCubes();
    addSpheres();
    addTriangles();
}



//grid
const gridHelper = new THREE.GridHelper( 400, 40, 0xbe03fc, 0xbe03fc );
gridHelper.position.y = 0;
gridHelper.position.x = 0;
gridHelper.rotateX(0.1);
scene.add( gridHelper );


//camera position
camera.position.z = 65;
camera.position.y = 3;
camera.position.x = 5;

const animate = function () {
    requestAnimationFrame( animate );
    for (let i = 0; i < 500; i++){
        cubeArray[i].rotation.x += 0.01;
        cubeArray[i].position.x += 0.025;
        cubeArray[i].rotation.y += 0.005;
        cubeArray[i].rotation.z += 0.01;
        sphereArray[i].rotation.x += 0.01;
        sphereArray[i].position.x += 0.025;
        sphereArray[i].rotation.y += 0.005;
        sphereArray[i].rotation.z += 0.01;
        coneArray[i].rotation.x += 0.01;
        coneArray[i].position.x += 0.025;
        coneArray[i].rotation.y += 0.005;
        coneArray[i].rotation.z += 0.01;
    }

    renderer.render( scene, camera );
};

//window
window.addEventListener( 'resize', onWindowResize, false ); 

//animate
animate();

function addCubes(){
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: colors[THREE.MathUtils.randInt(0,6)], wireframe: true } );
    const cube = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-500,50);
    y = THREE.MathUtils.randFloat(9,38);
    z = THREE.MathUtils.randFloat(-26,30);
    cube.position.set(x,y,z);
    scene.add( cube );
    cubeArray.push(cube);
}
function addSpheres(){
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshBasicMaterial( { color: colors[THREE.MathUtils.randInt(0,6)], wireframe: true } );
    const sphere = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-500,50);
    y = THREE.MathUtils.randFloat(9,38);
    z = THREE.MathUtils.randFloat(-26,30);
    sphere.position.set(x,y,z);
    scene.add( sphere );
    sphereArray.push(sphere);

}
function addTriangles(){
    const geometry = new THREE.ConeGeometry();
    const material = new THREE.MeshBasicMaterial( { color: colors[THREE.MathUtils.randInt(0,6)], wireframe: true } );
    const triangle = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-500,50);
    y = THREE.MathUtils.randFloat(9,38);
    z = THREE.MathUtils.randFloat(-26,30);
    triangle.position.set(x,y,z);
    scene.add( triangle );
    coneArray.push(triangle);

}

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
  