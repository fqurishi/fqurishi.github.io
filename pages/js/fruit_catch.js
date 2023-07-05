document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");

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

    function moveCatcher(event) {
      if (gameover) return;
      catcherX = event.clientX - canvas.offsetLeft - catcherWidth / 2;
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
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        object.y += objectSpeed;

        // Check collision with catcher
        if (
          object.y + objectSize >= catcherY &&
          object.x + objectSize >= catcherX &&
          object.x <= catcherX + catcherWidth
        ) {
          if (object.catchable) {
            score++;
          } else {
            explode();
          }
          objects.splice(i, 1);
          i--;
        }

        // Check if object is off the screen
        if (object.y > canvas.height) {
          objects.splice(i, 1);
          i--;
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
      context.fillText(`Score: ${score}`, 10, 30);

      // Draw timer
      context.fillText(`Time: ${Math.ceil(timer)}`, 10, 60);

      // Game over
      if (gameover) {
        context.fillStyle = "black";
        context.font = "40px Arial";
        clearInterval(timerInterval);
        if (score >= 25) {
          context.fillText("You Win!", canvas.width / 2 - 100, canvas.height / 2);
        } else {
          context.fillText("You Lose!", canvas.width / 2 - 100, canvas.height / 2);
        }
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

    gameLoop();
  });