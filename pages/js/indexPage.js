import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

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
const gridHelper = new THREE.GridHelper( 400, 40, 0x808080, 0x808080 );
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

animate();

function addCubes(){
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } );
    const cube = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-200,200);
    y = THREE.MathUtils.randFloat(8,40);
    z = THREE.MathUtils.randFloat(-26,30);
    cube.position.set(x,y,z);
    scene.add( cube );
    cubeArray.push(cube);
}
function addSpheres(){
    const geometry = new THREE.SphereGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } );
    const sphere = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-200,200);
    y = THREE.MathUtils.randFloat(8,40);
    z = THREE.MathUtils.randFloat(-26,30);
    sphere.position.set(x,y,z);
    scene.add( sphere );
    sphereArray.push(sphere);

}
function addTriangles(){
    const geometry = new THREE.ConeGeometry();
    const material = new THREE.MeshBasicMaterial( { color: 0x808080, wireframe: true } );
    const triangle = new THREE.Mesh( geometry, material );
    let x,y,z;
    x = THREE.MathUtils.randFloat(-200,200);
    y = THREE.MathUtils.randFloat(8,40);
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


function openPage(pageName,elmnt,color) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("w3-bar-item w3-button w3-padding-large w3-hide-small");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].style.backgroundColor = "";
    }
    document.getElementById(pageName).style.display = "block";
  }
  
  // Get the element with id="defaultOpen" and click on it
  document.getElementById("defaultOpen").click();