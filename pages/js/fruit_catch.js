document.addEventListener("DOMContentLoaded", function () {
  const startButton = document.querySelector('.start-button');
  const overlay = document.querySelector('.overlay');
  const canvas = document.getElementById("gameCanvas");
  const context = canvas.getContext("2d");

  const catchEffect = new Audio('../pages/resources/catch.mp3');
  const bombEffect = new Audio('../pages/resources/explode.mp3');

  // Set canvas dimensions to match the screen size
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const catcherWidth = 60;
  const catcherHeight = 40;
  let catcherX = canvas.width / 2 - catcherWidth / 2;
  const catcherY = canvas.height - 20;

  const objectSize = 20;
  const objectSpeed = 10;
  const catchableObjects = ["🍎", "🍓", "🍌", "💣"]; // Customize the catchable objects

  let score = 0;
  let gameover = false;
  let exploded = false;

  const gameDuration = 45; // Game duration in seconds
  let timer = gameDuration;
  let timerInterval;

  canvas.addEventListener("mousemove", moveCatcher);
  canvas.addEventListener('touchmove', function(event) {
    event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
    moveCatcher(event);
  }, false);

  function moveCatcher(event) {
    let daX;

    if (event.type === 'mousemove') {
      daX = event.clientX;
    } else if (event.type === 'touchmove') {
      daX = event.touches[0].clientX;
    }
    if (gameover) return;
    catcherX = daX - canvas.offsetLeft - catcherWidth / 2;
    if (catcherX < 0) {
      catcherX = 0;
    } else if (catcherX + catcherWidth > canvas.width) {
      catcherX = canvas.width - catcherWidth;
    }
  }

  function generateRandomObject() {
    const objectIndex = Math.floor(Math.random() * catchableObjects.length);
    const object = catchableObjects[objectIndex];
    const objectX = Math.random() * (canvas.width - objectSize);
    const objectY = 0 - objectSize;
    const isCatchable = !isBomb(object);
    return { object, x: objectX, y: objectY, catchable: isCatchable };
  }

  function isBomb(object) {
    return object === "💣";
  }

  const objects = [];

  function update() {
    if (gameover) return;
  
    // Move objects
    for (let i = objects.length - 1; i >= 0; i--) {
      const object = objects[i];
      if (!object) continue; // Skip iteration if object is undefined
  
      object.y += objectSpeed;
  
      // Check if object is still within the game bounds
      if (object.y && object.x) {
        // Check collision with catcher
        if (
          object.y + objectSize >= catcherY &&
          object.x + objectSize >= catcherX &&
          object.x <= catcherX + catcherWidth
        ) {
          if (object.catchable) {
            catchEffect.play();
            score++;
          } else {
            bombEffect.play();
            explode();
          }
          objects.splice(i, 1);
        }
      }
  
      // Check if object is off the screen
      if (object.y && object.y > canvas.height) {
        objects.splice(i, 1);
      }
    }
  
    // Generate new objects
    if (Math.random() < 0.02) {
      objects.push(generateRandomObject());
    }
  
    // Update timer
    timer -= 1 / 60; // Subtract 1 second divided by 60 frames per second
    if (timer <= 0) {
      gameover = true;
    }
  }  

  function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw catcher
    if (!exploded) {
      context.beginPath();
      context.moveTo(catcherX, catcherY - catcherHeight);
      context.lineTo(catcherX + catcherWidth, catcherY - catcherHeight);
      context.lineTo(catcherX + catcherWidth * 0.75, catcherY);
      context.lineTo(catcherX + catcherWidth * 0.25, catcherY);
      context.closePath();
      context.fillStyle = "black";
      context.fill();
    }
    else{
      context.font = `${objectSize}px Arial`;
      context.fillText("💥", catcherX, catcherY - catcherHeight / 2 + objectSize / 2);
    }

    // Draw objects
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i];
      context.font = `${objectSize}px Arial`;
      context.fillText(object.object, object.x, object.y);
    }

    // Draw score
    context.fillStyle = "black";
    context.font = "20px Arial";
    context.fillText(`Catch The Fruit!`, 10, 30);
    context.fillText(`Score: ${score}`, 10, 60);
    // Draw timer
    context.fillText(`Time: ${Math.ceil(timer)}`, 10, 90);

    // Game over
    if (gameover) {
      context.fillStyle = "black";
      context.font = "40px Arial";
      clearInterval(timerInterval);
      if (score >= 12) {
        context.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
      } else {
        context.fillText("You Lose!", canvas.width / 2 - 100, canvas.height / 2);
      }

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
  }

  function explode() {
    exploded = true;
    gameover = true;
  }

  function gameLoop() {
    update();
    draw();

    if (!gameover) {
      requestAnimationFrame(gameLoop);
    }
  }

  timerInterval = setInterval(() => {
    timer -= 1;
    if (timer <= 0) {
      gameover = true;
      clearInterval(timerInterval);
    }
  }, 1000);

  startButton.addEventListener('click', function () {
    overlay.style.display = 'none';
    const startSound = new Audio('../pages/resources/catchfruit.mp3');
    startSound.play();
    gameLoop();
  });
});
