const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const explodeEffect = new Audio('../resources/explode.mp3');
const beepEffect = new Audio('../resources/beep.mp3');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timer = 45; // Timer in seconds
let gameOver = false;
let lives = 3;

document.getElementById('timerText').textContent = `Timer: ${timer}`;
document.getElementById('lifeText').textContent = `Life: ${lives}`;

const bombColors = ['blue', 'green'];
const containerColors = ['lightblue', 'lightgreen'];
const bombSize = 30;
const containerSize = 150;
const explosionTime = 5; // Time in seconds
const blinkStartTime = 3; // Time in seconds
const blinkInterval = 0.5; // Time in seconds

let bombs = [];
let containers = [];

canvas.addEventListener('mousedown', startDrag);
canvas.addEventListener('mousemove', drag);
canvas.addEventListener('mouseup', stopDrag);

canvas.addEventListener('touchstart', startDrag);
canvas.addEventListener('touchmove', drag);
canvas.addEventListener('touchend', stopDrag);

let selectedBomb = null;
let isDragging = false;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function createContainers() {
    const container1 = {
        color: containerColors[0],
        x: 0,
        y: canvas.height / 2 - containerSize / 2
    };

    const container2 = {
        color: containerColors[1],
        x: canvas.width - containerSize,
        y: canvas.height / 2 - containerSize / 2
    };

    containers.push(container1);
    containers.push(container2);
}

function drawContainers() {
    containers.forEach(container => {
        ctx.fillStyle = container.color;
        ctx.fillRect(container.x, container.y, containerSize, containerSize);
    });
}

function updateBombs() {
    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i];

        if (bomb.isDragging || bomb.isSorted) {
            bomb.color = bomb.ogColor;
            continue;
        }

        bomb.timeLeft -= 1 / 60; // Decrease time left

        if (bomb.timeLeft <= 0) {
            //play sound effect
            explodeEffect.play();
            bomb.color = 'darkred';
            bomb.size = bombSize * (3.5 + bomb.timeLeft);
            bomb.exploded = true;
            if (bomb.timeLeft <= -2) {
                explodeBomb(i);
            }
        } else if (bomb.timeLeft <= blinkStartTime && Math.floor(bomb.timeLeft / blinkInterval) % 2 === 0) {
            beepEffect.play();
            bomb.color = bomb.ogColor;
        } else if (bomb.timeLeft <= blinkStartTime && Math.floor(bomb.timeLeft / blinkInterval) % 2 === 1) {
            bomb.color = 'red';
        }
    }
}

function drawBombs() {
    bombs.forEach(bomb => {
        ctx.fillStyle = bomb.color;
        ctx.beginPath();
        ctx.arc(bomb.x, bomb.y, bomb.size / 2, 0, Math.PI * 2);
        ctx.fill();
    });
}

function createBomb() {
    const bombColor = getRandomBombColor();

    const container1 = containers[0];
    const container2 = containers[1];

    if (Math.floor(Math.random() * 11) == 1) {
        // 10% chance of creating two bombs
        createSingleBomb(bombColor, container1, container2);
        createSingleBomb(bombColor, container1, container2);
    } else {
        createSingleBomb(bombColor, container1, container2);
    }
}

function createSingleBomb(bombColor, container1, container2) {
    const bomb = {
        color: bombColor,
        x: getRandomPositionOutsideContainer(container1, container2).x,
        y: getRandomPositionOutsideContainer(container1, container2).y,
        size: bombSize,
        timeLeft: explosionTime,
        container: bombColor === 'blue' ? containerColors[0] : containerColors[1],
        ogColor: bombColor,
        isDragging: false,
        isSorted: false,
        exploded: false
    };

    bombs.push(bomb);
}

function getRandomPositionOutsideContainer(container1, container2) {
    const minX1 = container1.x - bombSize;
    const maxX1 = container1.x + containerSize;
    const minY1 = container1.y - bombSize;
    const maxY1 = container1.y + containerSize;
    const minX2 = container2.x - bombSize;
    const maxX2 = container2.x + containerSize;
    const minY2 = container2.y - bombSize;
    const maxY2 = container2.y + containerSize;

    let x, y;

    do {
        x = Math.random() * (canvas.width - bombSize);
        y = Math.random() * (canvas.height - bombSize);
    
        isInsideContainer1 = x >= minX1 && x <= maxX1 && y >= minY1 && y <= maxY1;
        isInsideContainer2 = x >= minX2 && x <= maxX2 && y >= minY2 && y <= maxY2;
    } while (isInsideContainer1 || isInsideContainer2);

    return { x: x, y: y };
}
  

function getRandomBombColor() {
  return bombColors[Math.floor(Math.random() * bombColors.length)];
}

function explodeBomb(index) {
    lives--;
    bombs.splice(index, 1);
    document.getElementById('lifeText').textContent = `Life: ${lives}`;
}

function startDrag(event) {
    let mouseX, mouseY;

    if (event.type === 'mousedown') {
        mouseX = event.clientX - canvas.offsetLeft;
        mouseY = event.clientY - canvas.offsetTop;
    } else if (event.type === 'touchstart') {
        mouseX = event.touches[0].clientX - canvas.offsetLeft;
        mouseY = event.touches[0].clientY - canvas.offsetTop;
    }

    for (let i = bombs.length - 1; i >= 0; i--) {
        const bomb = bombs[i];
        const boundarySize = bomb.size * 2; // Increase the boundary size

        if (
            bomb.exploded == false && (
            mouseX >= bomb.x - boundarySize / 2 &&
            mouseX <= bomb.x + boundarySize / 2 &&
            mouseY >= bomb.y - boundarySize / 2 &&
            mouseY <= bomb.y + boundarySize / 2)
        ) {
            selectedBomb = bomb;
            isDragging = true;
            bomb.isDragging = true;
            break;
        }
    }   
}

function drag(event) {
    if (!isDragging) {
        return;
    }

    let mouseX, mouseY;

    if (event.type === 'mousemove') {
        mouseX = event.clientX - canvas.offsetLeft;
        mouseY = event.clientY - canvas.offsetTop;
    } else if (event.type === 'touchmove') {
        mouseX = event.touches[0].clientX - canvas.offsetLeft;
        mouseY = event.touches[0].clientY - canvas.offsetTop;
    }

    selectedBomb.x = mouseX;
    selectedBomb.y = mouseY;
}

function stopDrag() {
    if (!isDragging) {
        return;
    }

    selectedBomb.isDragging = false;
    isDragging = false;

    const mouseX = event.clientX - canvas.offsetLeft;
    const mouseY = event.clientY - canvas.offsetTop;

    const container1 = containers[0];
    const container2 = containers[1];

    if (
        (selectedBomb.ogColor === 'blue' &&
        mouseX >= container1.x &&
        mouseX <= container1.x + containerSize &&
        mouseY >= container1.y &&
        mouseY <= container1.y + containerSize)
        ||
        (selectedBomb.ogColor === 'green' &&
        mouseX >= container2.x &&
        mouseX <= container2.x + containerSize &&
        mouseY >= container2.y &&
        mouseY <= container2.y + containerSize)
    ) {
        selectedBomb.isSorted = true;
        selectedBomb.timeLeft = explosionTime;
    } else if (
        (selectedBomb.ogColor === 'green' &&
        mouseX >= container1.x &&
        mouseX <= container1.x + containerSize &&
        mouseY >= container1.y &&
        mouseY <= container1.y + containerSize)
        || (selectedBomb.ogColor === 'blue' &&
        mouseX >= container2.x &&
        mouseX <= container2.x + containerSize &&
        mouseY >= container2.y &&
        mouseY <= container2.y + containerSize)
    ) {
        selectedBomb.timeLeft = 0;
    } else {
        // do nothing
    }
    
    selectedBomb = null;
}

function startGame() {
    setInterval(updateGame, 1000 / 60); // 60 frames per second
    setInterval(updateTimer, 1000); // Update timer every second

    createContainers();
}
  
function updateGame() {
    if (!gameOver){
        clearCanvas();
        drawContainers();
        updateBombs();
        drawBombs();
    }
    else{
        setTimeout(() => {
            const gamePages = ["moving_target", "trace", "samurai", "fruit_catch"];
            const randomIndex = Math.floor(Math.random() * gamePages.length);
            const pageUrl = gamePages[randomIndex];
            window.location.href = pageUrl;
          }, 3000);
    }

}
  
function updateTimer() {
    if (timer > 0 && lives >= 0) {
        timer--;
        document.getElementById('timerText').textContent = `Timer: ${timer}`;
    } else {
        endGame();
    }
}
  
function endGame() {
    gameOver = true;
    clearInterval(bombCreationInterval); // stop making bombs
    if (lives > 0) {
        showGameOver('You Win!');
    } else {
        showGameOver('You Lose!');
    }
}
  
function showGameOver(text) {
    const gameOverText = document.getElementById('gameOverText');
    gameOverText.style.display = 'block';
    gameOverText.textContent = text;
}

startGame();
const bombCreationInterval = setInterval(createBomb, 1800);
  
