const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gameTitle = document.getElementById('gameTitle');

const bgmSound = new Audio('../pages/resources/bullet_hell.mp3');
const ohnoEffect = new Audio('../pages/resources/oh_no.mp3')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const playerRadius = 15;
const orbRadius = 10;
const orbSpeed = 12;
const timerDuration = 45; // Timer duration in seconds

let playerX = canvas.width / 2;
let playerY = canvas.height / 2;
let orbs = [];
let timer = timerDuration;
let gameEnded = false;
let lives = 1;

canvas.addEventListener('mousemove', handleMouseMove);
canvas.addEventListener('touchmove', handleMouseMove);


startGame();

function startGame() {
    bgmSound.play();
    setInterval(updateGame, 1000 / 60); // 60 frames per second
    setInterval(updateTimer, 1000);

    createOrbs();
}

function updateGame() {
  if (!gameEnded) {
    clearCanvas();
    updatePlayer();
    updateOrbs();
    drawPlayer();
    drawOrbs();
    updateTimerDisplay();
  }
  else{
    setTimeout(() => {
        const gamePages = ["trace", "fruit_catch", "samurai", "sorting", "moving_target", "whack_mole"];
        const randomIndex = Math.floor(Math.random() * gamePages.length);
        const pageUrl = gamePages[randomIndex];
        window.location.href = pageUrl;
    }, 3000);
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function handleMouseMove(event) {
    let playerX, playerY;

    if (event.type === 'mousemove') {
        playerX = event.clientX;
        playerY = event.clientY;
    } else if (event.type === 'touchmove') {
        playerX = event.touches[0].clientX;
        playerY = event.touches[0].clientY;
    }
    updatePlayerPosition(playerX, playerY);
}

function updatePlayerPosition(x, y) {
  playerX = x;
  playerY = y;
}

function createOrbs() {
    setInterval(() => {
        if (!gameEnded) {
            const side = Math.floor(Math.random() * 4); // Randomly select a side (0: top, 1: right, 2: bottom, 3: left)
            let x, y, speedX, speedY;
  
            switch (side) {
            case 0: // Top side
                x = Math.random() * canvas.width;
                y = -orbRadius;
                speedX = Math.random() * 2 - 1;
                speedY = orbSpeed;
                break;
            case 1: // Right side
                x = canvas.width + orbRadius;
                y = Math.random() * canvas.height;
                speedX = -orbSpeed;
                speedY = Math.random() * 2 - 1;
                break;
            case 2: // Bottom side
                x = Math.random() * canvas.width;
                y = canvas.height + orbRadius;
                speedX = Math.random() * 2 - 1;
                speedY = -orbSpeed;
                break;
            case 3: // Left side
                x = -orbRadius;
                y = Math.random() * canvas.height;
                speedX = orbSpeed;
                speedY = Math.random() * 2 - 1;
                break;
            }
    
            const orb = {
            x,
            y,
            speedX,
            speedY,
            };
            orbs.push(orb);
        }
    }, 100);
}
  

function updateOrbs() {
  for (let i = orbs.length - 1; i >= 0; i--) {
    const orb = orbs[i];

    orb.x += orb.speedX;
    orb.y += orb.speedY;

    if (orb.y > canvas.height + orbRadius) {
      orbs.splice(i, 1);
    }

    if (
      playerX - playerRadius < orb.x + orbRadius &&
      playerX + playerRadius > orb.x - orbRadius &&
      playerY - playerRadius < orb.y + orbRadius &&
      playerY + playerRadius > orb.y - orbRadius
    ) {
        lives--;
        bgmSound.pause();
        ohnoEffect.play();
        endGame();
        break;
    }
  }
}

function drawOrbs() {
  ctx.fillStyle = 'red';
  orbs.forEach(orb => {
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, orbRadius, 0, Math.PI * 2);
    ctx.fill();
  });
}

function updatePlayer() {
  // Add any player movement logic here
}

function drawPlayer() {
    // Draw the circle for the face
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius, 0, Math.PI * 2);
    ctx.fill();
  
    // Draw the eyes
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(playerX - playerRadius / 2, playerY - playerRadius / 4, playerRadius / 8, 0, Math.PI * 2);
    ctx.arc(playerX + playerRadius / 2, playerY - playerRadius / 4, playerRadius / 8, 0, Math.PI * 2);
    ctx.fill();
  
    // Draw the smile
    ctx.strokeStyle = 'white';
    ctx.lineWidth = playerRadius / 16;
    ctx.beginPath();
    ctx.arc(playerX, playerY, playerRadius / 2, Math.PI / 4, (Math.PI * 3) / 4);
    ctx.stroke();
  }
  

function updateTimer() {
  if (timer > 0) {
    timer--;
  } else {
    endGame();
  }
}

function endGame() {
  gameEnded = true;

  clearCanvas();

  ctx.fillStyle = 'black';
  ctx.font = '50px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(
    lives == 1 ? 'You Win!' : 'You Lose!',
    canvas.width / 2,
    canvas.height / 2
  );
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timerText');
    timerElement.textContent = `Timer: ${timer}`;
}