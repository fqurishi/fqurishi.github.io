import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.1/build/three.module.js';
const clock = new THREE.Clock();

let timer = 45; // Timer in seconds
let gameOver = false;

const hurtEffect = new Audio('../pages/resources/hurt.mp3');
const clangEffect = new Audio('../pages/resources/clang.mp3');


// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// create text
// Update the block text and timer text
document.getElementById('blockText').textContent = 'Block the Red!';
document.getElementById('timerText').textContent = `Timer: ${timer}`;

// Create the samurai mesh
const samuraiGeometry = new THREE.BoxGeometry(1, 1, 1);
const samuraiMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const samurai = new THREE.Mesh(samuraiGeometry, samuraiMaterial);
scene.add(samurai);

// Create the player mesh
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
scene.add(player);

// Create the sword mesh
const swordGeometry = new THREE.BoxGeometry(0.25, 0.25, 0.25);
const swordMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const sword = new THREE.Mesh(swordGeometry, swordMaterial);
scene.add(sword);

// Position the samurai, player, and sword
samurai.position.z = -5;
player.position.z = 1;
sword.position.z = -0.25;
camera.position.y = 2.5;
camera.position.z = 4;
camera.lookAt(0,0,-2);

// Add the objects to the scene
scene.add(samurai);
scene.add(player);
scene.add(sword);

let samuraiDirection = new THREE.Vector3(0, 0, 0); // Initial direction
let samuraiPosition = new THREE.Vector3(0, 0, 0); // Initial position
let samuraiTarget = new THREE.Vector3(0, 0, -5); // Target position
const samuraiSpeed = 0.15; // Movement speed

// Create a text sprite for displaying messages
function createTextSprite(message, position) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = 'Bold 24px Arial';
    context.fillStyle = '#ff0000';
    context.fillText(message, 0, 24);
    
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(2, 1, 1);
    sprite.position.copy(position);
    // Set the sprite's position with an offset on the Y-axis
    sprite.position.copy(position).add(new THREE.Vector3(0, 1, 0));
    
    return sprite;
}
  
let hitText;
let blockedText;
let textDisplayDuration = 0.75; // Duration of text display in seconds
let textTimer = 0;
let life = 4;
  
function displayText(text) {
    const textSprite = createTextSprite(text, player.position);
    scene.add(textSprite);
    return textSprite;
}
  
function updateTextSprites(deltaTime) {
    if (textTimer > 0) {
        textTimer -= deltaTime;
        
        if (textTimer <= 0) {
        // Remove text sprites from the scene
            if (hitText) {
                scene.remove(hitText);
                hitText = undefined;
            }
            if (blockedText) {
                scene.remove(blockedText);
                blockedText = undefined;
            }
        }
    }
}

function generateRandomDirection() {
    const x = samuraiPosition.x;
    const y = samuraiPosition.y;
    const z = samuraiPosition.z;
    let possibleDirections = [];
  
    if (x === 5 && y === 0) {
        possibleDirections.push(new THREE.Vector3(-5, 0, 0)); // Move left
        possibleDirections.push(new THREE.Vector3(0, 5, 0)); // Move up
        possibleDirections.push(new THREE.Vector3(0, -5, 0)); // Move down
        possibleDirections.push(new THREE.Vector3(-5, 5, 0)); // Diagonal top left
        possibleDirections.push(new THREE.Vector3(-5, -5, 0)); // Diagonal bottom left
    } else if (x === -5 && y === 0) {
        possibleDirections.push(new THREE.Vector3(5, 0, 0)); // Move right
        possibleDirections.push(new THREE.Vector3(0, 5, 0)); // Move up
        possibleDirections.push(new THREE.Vector3(0, -5, 0)); // Move down
        possibleDirections.push(new THREE.Vector3(5, 5, 0)); // Diagonal top right
        possibleDirections.push(new THREE.Vector3(5, -5, 0)); // Diagonal bottom right
    } else if (y === -5 && x === 0) {
        possibleDirections.push(new THREE.Vector3(-5, 0, 0)); // Move left
        possibleDirections.push(new THREE.Vector3(5, 0, 0)); // Move right
        possibleDirections.push(new THREE.Vector3(0, 5, 0)); // Move up
        possibleDirections.push(new THREE.Vector3(-5, 5, 0)); // Diagonal top left
        possibleDirections.push(new THREE.Vector3(5, 5, 0)); // Diagonal top right
    } else if (y === 5 && x === 0) {
        possibleDirections.push(new THREE.Vector3(-5, 0, 0)); // Move left
        possibleDirections.push(new THREE.Vector3(5, 0, 0)); // Move right
        possibleDirections.push(new THREE.Vector3(0, -5, 0)); // Move down
        possibleDirections.push(new THREE.Vector3(-5, -5, 0)); // Diagonal bottom left
        possibleDirections.push(new THREE.Vector3(5, -5, 0)); // Diagonal bottom right
    } else if (y === 5 && x === 5) {
        possibleDirections.push(new THREE.Vector3(-5, 0, 0)); // Move left
        possibleDirections.push(new THREE.Vector3(0, -5, 0)); // Move down
        possibleDirections.push(new THREE.Vector3(-5, -5, 0)); // Diagonal bottom left
    } else if (y === 5 && x === -5) {
        possibleDirections.push(new THREE.Vector3(5, 0, 0)); // Move right
        possibleDirections.push(new THREE.Vector3(0, -5, 0)); // Move down
        possibleDirections.push(new THREE.Vector3(5, -5, 0)); // Diagonal bottom right
    } else if (y === -5 && x === 5) {
        possibleDirections.push(new THREE.Vector3(-5, 0, 0)); // Move left
        possibleDirections.push(new THREE.Vector3(0, 5, 0)); // Move up
        possibleDirections.push(new THREE.Vector3(-5,5, 0)); // Diagonal top left
    } else if (y === -5 && x === -5) {
        possibleDirections.push(new THREE.Vector3(5, 0, 0)); // Move right
        possibleDirections.push(new THREE.Vector3(0, 5, 0)); // Move up
        possibleDirections.push(new THREE.Vector3(5,5, 0)); // Diagonal top right
    } else{
        possibleDirections.push(new THREE.Vector3(-5, 0, 0)); // Move left
        possibleDirections.push(new THREE.Vector3(5, 0, 0)); // Move right
        possibleDirections.push(new THREE.Vector3(0, 5, 0)); // Move up
        possibleDirections.push(new THREE.Vector3(0, -5, 0)); // Move down
        possibleDirections.push(new THREE.Vector3(-5, 5, 0)); // Diagonal top left
        possibleDirections.push(new THREE.Vector3(-5, -5, 0)); // Diagonal bottom left
        possibleDirections.push(new THREE.Vector3(5, 5, 0)); // Diagonal top right
        possibleDirections.push(new THREE.Vector3(5, -5, 0)); // Diagonal bottom right
    }

    //return one of the possible directions
    return possibleDirections[Math.floor(Math.random() * possibleDirections.length)];

}
function updateSamuraiDirection() {
  samuraiDirection = generateRandomDirection();
  samuraiTarget.copy(samuraiPosition).add(samuraiDirection); // Set target position
}

let samuraiMovingToPlayer = false;
let samuraiMovingToOrigin = false;
let samuraiTargetReached = true;

function samuraiMove() {
    if (samuraiTargetReached) {
        if (samuraiMovingToPlayer) {
            samuraiTarget.copy(player.position); // Move towards player's position
        } else if (samuraiMovingToOrigin) {
            samuraiTarget.set(0, 0, -5); // Move back to origin position
        } else {
            updateSamuraiDirection();
            samuraiTarget.copy(samuraiPosition).add(samuraiDirection);
        }

    samuraiTargetReached = false;
    }   

    // Move the samurai towards the target position
    samurai.position.lerp(samuraiTarget, samuraiSpeed);

    // Check for collision with the player's cube if moving towards player
    if (samuraiMovingToPlayer) {
        const samuraiBox = new THREE.Box3().setFromObject(samurai);
        const playerBox = new THREE.Box3().setFromObject(player);
        const swordBox = new THREE.Box3().setFromObject(sword);

        if (samuraiBox.intersectsBox(swordBox)) {
            console.log("Block!")
            clangEffect.play();
            // Collision with player's cube
            samuraiMovingToPlayer = false; // Reset flag
            samuraiTarget.set(0, 0, -5); // Move back to origin position
            samuraiTargetReached = true;
            samuraiMovingToOrigin = true; // Set flag to move back to origin
            
            // Display "BLOCKED!" text
            if (blockedText) {
                scene.remove(blockedText);
                blockedText = null;
            }
            blockedText = displayText('BLOCKED!');
            textTimer = textDisplayDuration;
        }
        else if (samuraiBox.intersectsBox(playerBox)) {
            life--;
            console.log("Direct hit!")
            hurtEffect.play();
            // Collision with player's cube
            samuraiMovingToPlayer = false; // Reset flag
            samuraiMovingToOrigin = true; // Set flag to move back to origin

            // Display "HIT!" text
            if (hitText) {
                scene.remove(hitText);
                hitText = null;
            }
            hitText = displayText('HIT!');
            textTimer = textDisplayDuration;
        }
    } 

    // Check if reached the target position
    if (samurai.position.distanceTo(samuraiTarget) < samuraiSpeed) {

        if (samuraiMovingToOrigin) {
            samuraiMovingToOrigin = false; // Reset flag
        }

        if (samuraiPosition.z != -5){
            samuraiMovingToOrigin = true;
        }

        if (!samuraiMovingToPlayer && samuraiPosition.z == -5 && Math.random() < 0.1) {
            samuraiMovingToPlayer = true; // Move towards player's position
        }

        samurai.position.copy(samuraiTarget); // Snap to the target position
        samuraiPosition.copy(samuraiTarget); // Update current position

        samuraiTargetReached = true;
    }
}

// Update the scene and text sprites
function update(deltaTime) {
    if (!gameOver) {
        samuraiMove();
        updateTextSprites(deltaTime);

        // Update the timer
        timer -= deltaTime;
        if (timer < 0 || life < 0) {
            timer = 0;
            gameOver = true;

            // Remove all other objects from the scene
            scene.remove(samurai);
            scene.remove(player);
            scene.remove(sword);
            scene.remove(hitText);
            scene.remove(blockedText);
            // Display "Game Over!" text in the center
            if(life <= 0)
                document.getElementById('gameOverText').textContent = 'You lose!';
            else
                document.getElementById('gameOverText').textContent = 'You Win!'
        }
        // Update the timer text & life text
        document.getElementById('timerText').textContent = `Timer: ${Math.floor(timer)}`;
        document.getElementById('lifeText').textContent = `Life: ${Math.floor(life)}`;
  
        renderer.render(scene, camera);
    }
    else{
        setTimeout(() => {
          const gamePages = ["trace", "fruit_catch", 'moving_target', 'sorting'];
          const randomIndex = Math.floor(Math.random() * gamePages.length);
          const pageUrl = gamePages[randomIndex];
          window.location.href = pageUrl;
        }, 3000);
    }
}
  
// Animate the scene
function animate() {
    requestAnimationFrame(animate);

    const deltaTime = clock.getDelta();
    update(deltaTime);
}
animate();

// Update the sword's position based on mouse movement
function updateSwordPosition(event) {
    let mouseX, mouseY;

    if (event.type === 'mousemove') {
        mouseX = event.clientX;
        mouseY = event.clientY;
    } else if (event.type === 'touchmove') {
        mouseX = event.touches[0].clientX;
        mouseY = event.touches[0].clientY;
    }
    const swordPositionX = (mouseX / window.innerWidth) * 10 - 5; // Map mouse X position to range -1 to 1
    const swordPositionY = -(mouseY / window.innerHeight) * 10 + 5; // Map mouse Y position to range -1 to 1

    // Update the sword's position
    sword.position.x = swordPositionX;
    sword.position.y = swordPositionY;
}

// Add event listener for mouse movement
document.addEventListener('mousemove', updateSwordPosition, false);
document.addEventListener('touchmove', updateSwordPosition, false);