import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


const container = document.getElementById('scene')
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 0.5, 50 );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( container.offsetWidth, container.offsetHeight );
container.appendChild( renderer.domElement );

//lights
const light = new THREE.PointLight();
light.position.set( 200, 100, 150 );
scene.add( light );

//cube pic
const texture = new THREE.TextureLoader().load( '../images/faislqurishi.jpg' ); 
const geometry = new THREE.BoxBufferGeometry(2.5 , 2.5, 2.5); 
const material = new THREE.MeshBasicMaterial( {map: texture} );  
const mesh = new THREE.Mesh( geometry, material ); 

mesh.position.y += 0.175;
mesh.position.z -= 0.5;
scene.add( mesh );

//colors
const blue = 0x4a03fc;
const red = 0xfc0303;
const yellow = 0xcd703;
const white = 0x4d4d4;
const orange = 0xff9500;
const green = 0x0ed10a;
const cyan = 0x05e3be;
const colors = [blue, red, yellow, white, orange, green, cyan];

//random objects to float behind pic
const cubeArray = [];
const sphereArray = []; 
const coneArray = [];
for (let i = 0; i < 20; i++){
    addCubes();
    addSpheres();
    addTriangles();
}

//camera
camera.position.z = 5;

//window 
window.addEventListener( 'resize', onWindowResize, false ); 

//animate
animate();



function onWindowResize() 
{ 
camera.aspect = container.offsetWidth / container.offsetHeight; 
camera.updateProjectionMatrix(); 

renderer.setSize( container.offsetWidth, container.offsetHeight ); 
} 

function animate() 
{ 
requestAnimationFrame( animate ); 
mesh.rotation.y += 0.007;
for (let i = 0; i < 20; i++){
    cubeArray[i].rotation.x += 0.01;
    cubeArray[i].position.x -= 0.0075;
    cubeArray[i].rotation.z += 0.005;
    sphereArray[i].rotation.x += 0.01;
    sphereArray[i].position.x -= 0.0075;
    sphereArray[i].rotation.z += 0.005;
    coneArray[i].rotation.x += 0.01;
    coneArray[i].position.x -= 0.0075;
    coneArray[i].rotation.z += 0.005;
}

renderer.render( scene, camera ); 
}


function addCubes(){
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: colors[THREE.MathUtils.randInt(0,6)], wireframe: true } );
    const cube = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-180,180);
    y = THREE.MathUtils.randFloat(-1,3);
    z = THREE.MathUtils.randFloat(-46,-8);
    cube.position.set(x,y,z);
    scene.add( cube );
    cubeArray.push(cube);
}
function addSpheres(){
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshBasicMaterial( { color: colors[THREE.MathUtils.randInt(0,6)], wireframe: true } );
    const sphere = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-180,180);
    y = THREE.MathUtils.randFloat(-1,3);
    z = THREE.MathUtils.randFloat(-46,-8);
    sphere.position.set(x,y,z);
    scene.add( sphere );
    sphereArray.push(sphere);

}
function addTriangles(){
    const geometry = new THREE.ConeGeometry();
    const material = new THREE.MeshBasicMaterial( { color: colors[THREE.MathUtils.randInt(0,6)], wireframe: true } );
    const triangle = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-180,180);
    y = THREE.MathUtils.randFloat(-1,3);
    z = THREE.MathUtils.randFloat(-46,-8);
    triangle.position.set(x,y,z);
    scene.add( triangle );
    coneArray.push(triangle);

}