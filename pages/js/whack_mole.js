const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameTitle = document.getElementById('gameTitle');

const monkeyEffect = new Audio('../pages/resources/monkey.mp3');
const owEffect = new Audio('../pages/resources/ow.mp3'); 

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const holeRadius = 30;
const moleRadius = 25;
const gap = 10;
const molesPerRow = 4;
const numRows = 5;
const moleInterval = 1500; // Time interval in milliseconds for mole appearance
const moleDuration = 1500; // Duration in milliseconds for mole visibility
const timerDuration = 45; // Timer duration in seconds
const scoreToWin = 25; // Score required to win
let timerInterval;
let createInterval;
let holeInterval;

let score = 0;
let timer = timerDuration;
let gameEnded = false;
let holes = [];

canvas.addEventListener('click', whackMole);

startGame();

function startGame() {
    if(!gameEnded){
        createHoles();
        drawHoles();
        updateScore();
        updateTimerDisplay();
        timerInterval = setInterval(updateTimer, 1000);
        createInterval = setInterval(createMolesAndMen, moleInterval);
    }
}

function updateTimer() {
  if (timer > 0) {
    holes.forEach(hole => {
      hole.moleTime--;
      if (hole.moleTime < 0){
        hole.moleTimeout = true;
        drawHoles();
      }
    });
    timer--;
    updateTimerDisplay();
  } else {
    score >= scoreToWin ? endGame("You Win!") : endGame("You Lose!");
    gameEnded = true;
  }
}

function createHoles() {
  const holeDiameter = holeRadius * 2 + gap;
  const offsetX = (canvas.width - (holeDiameter * molesPerRow - gap)) / 2;
  const offsetY = (canvas.height - (holeDiameter * numRows - gap)) / 2;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < molesPerRow; col++) {
      const hole = {
        x: offsetX + col * holeDiameter + holeRadius,
        y: offsetY + row * holeDiameter + holeRadius,
        isMole: false,
        isMan: false,
        moleTimeout: false,
        moleTime: 2,
      };

      holes.push(hole);
    }
  }
}

function drawHoles() {
  ctx.fillStyle = 'black'; // Black color for holes
  holes.forEach(hole => {
    ctx.beginPath();
    ctx.arc(hole.x, hole.y, holeRadius, 0, Math.PI * 2);
    ctx.fill();

    if (hole.isMole) {
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('🐵', hole.x, hole.y + 10);
    } else if (hole.isMan) {
      ctx.font = '30px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.fillText('👴', hole.x, hole.y + 10);
    }

    if (hole.moleTimeout == true){
      hole.isMan = false;
      hole.isMole = false;
    }
  });
}

function createMolesAndMen() {
    const holesToFill = getRandomInt(2, 4); // Randomly select 2-3 holes to fill

    for (let i = 0; i < holesToFill; i++) {
        const randomIndex = getRandomInt(0, holes.length);
        const hole = holes[randomIndex];

        if (!hole.isMole && !hole.isMan) {
        const randomValue = Math.random();

        if (randomValue < 0.5) {
            createMole(hole);
        } else {
            createMan(hole);
        }
        }
    }
    drawHoles();
}
  
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
  

function createMole(hole) {
  hole.isMole = true;
  hole.moleTime = 2;
  hole.moleTimeout = false;
}

function createMan(hole) {
  hole.isMan = true;
  hole.moleTime = 2;
  hole.moleTimeout = false;
}

function whackMole(event) {
  if (gameEnded) {
    return;
  }

  const mouseX = event.clientX;
  const mouseY = event.clientY;

  for (let i = 0; i < holes.length; i++) {
    const hole = holes[i];

    if (
      hole.isMole &&
      distance(mouseX, mouseY, hole.x, hole.y) <= moleRadius
    ) {
        monkeyEffect.play();
        hole.moleTime = 0;
        hole.moleTimeout = true;
        drawHoles();
        score++;
        updateScore();
        return;
    } else if (
      hole.isMan &&
      distance(mouseX, mouseY, hole.x, hole.y) <= holeRadius
    ) {
        owEffect.play();
        hole.moleTime = 0;
        hole.moleTimeout = true;
        drawHoles();
        score = score - 5;
        updateScore();
        return;
    }
    else{
      console.log(hole)
    }
  }
}

function updateScore() {
  const scoreElement = document.getElementById('scoreText');
  scoreElement.textContent = `Score: ${score}`;
}

function updateTimerDisplay() {
  const timerElement = document.getElementById('timerText');
  timerElement.textContent = `Timer: ${timer}`;
}

function endGame(message) {
    gameEnded = true;
    holes.length = 0;
    clearInterval(timerInterval);
    clearInterval(createInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = '50px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText(
        message ? message : 'You Lose!',
        canvas.width / 2,
        canvas.height / 2
    );
    setTimeout(() => {
      const overlay = document.getElementById("overlay_end");
      const playAgainButton = document.getElementById("play-again-button");
      const seeMoreGamesButton = document.getElementById("see-more-games-button");
      overlay.style.display = "flex";

      // Button event listeners
      playAgainButton.addEventListener("click", () => {
        window.location.reload(); // Reload the page to play again
      });

      seeMoreGamesButton.addEventListener("click", () => {
        window.location.href = "https://faislqurishi.dev/pages/Games"; // Navigate to the "See More Games" link
      });
    }, 3000);
}

function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}
