import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

//lights
const light = new THREE.PointLight();
light.position.set( 200, 100, 150 );
scene.add( light );

//cube
const texture = new THREE.TextureLoader().load( '../images/faislqurishi.jpg' ); 
const geometry = new THREE.BoxBufferGeometry(2 , 2, 2); 
const material = new THREE.MeshBasicMaterial( {map: texture} );  
const mesh = new THREE.Mesh( geometry, material ); 

mesh.position.y += 0.5;
scene.add( mesh );

camera.position.z = 5;

//window 
window.addEventListener( 'resize', onWindowResize, false ); 

//animate
animate();

function onWindowResize() 
{ 
camera.aspect = window.innerWidth / window.innerHeight; 
camera.updateProjectionMatrix(); 

renderer.setSize( window.innerWidth, window.innerHeight ); 
} 

function animate() 
{ 
requestAnimationFrame( animate ); 
mesh.rotation.y += 0.007; 

renderer.render( scene, camera ); 
}