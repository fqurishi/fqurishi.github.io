document.addEventListener("DOMContentLoaded", function () {
    const startButton = document.querySelector('.start-button');
    const overlay = document.querySelector('.overlay');
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
  
    // Set canvas dimensions to match the screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    const similarityThreshold = 0.25; // Adjust the threshold for similarity
    const timeLimit = 45; // Time limit in seconds
  
    let isDrawing = false;
    let path = [];
    let gameover = false;
    const shapePath = generateRandomShapePath(); // Generate the random shape path at the beginning
  
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", drawPath);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    canvas.addEventListener("touchstart", function(event) {
      event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
      startDrawing(event);
    }, false);
    canvas.addEventListener("touchmove", function(event) {
      event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
      drawPath(event);
    }, false);
    canvas.addEventListener("touchend", function(event) {
      event.preventDefault(); // Prevent default touch behavior (e.g., scrolling)
      stopDrawing(event);
    }, false);
      
    function startDrawing(event) {
      if (gameover) return;
      isDrawing = true;
      const { offsetX, offsetY } = event;
      path.push({ x: offsetX, y: offsetY });
      draw();
    }
  
    function drawPath(event) {
      if (!isDrawing) return;
      const { offsetX, offsetY } = event;
      path.push({ x: offsetX, y: offsetY });
      draw();
    }
  
    function stopDrawing() {
      if (gameover) return;
      isDrawing = false;
      checkWinCondition();
    }
  
    function generateRandomShapePath() {
      const startX = Math.random() * (canvas.width - 250);
      const startY = Math.random() * (canvas.height - 250);
  
      const shapePath = [];
      for (let i = 0; i < 4; i++) {
        const length = 50 + Math.random() * 100; // Random length between 50 and 150
        let line = { x: startX, y: startY };
        switch (i) {
          case 0: // Top line
            line.x += length;
            break;
          case 1: // Right line
            line.x += length;
            line.y += length;
            break;
          case 2: // Bottom line
            line.y += length;
            break;
          case 3: // Left line
            break; // Start position remains unchanged
        }
        shapePath.push(line);
      }
  
      return shapePath;
    }
  
    function checkWinCondition() {
      const similarity = calculateSimilarity(shapePath, path);
  
      if (similarity >= similarityThreshold) {
        gameover = true;
        displayResult("You Win!");
      } else {
        gameover = true;
        displayResult("You Lose!");
      }
      setTimeout(() => {
        const gamePages = ["moving_target", "fruit_catch", "samurai", "sorting", 'bullet_hell', 'whack_mole'];
        const randomIndex = Math.floor(Math.random() * gamePages.length);
        const pageUrl = gamePages[randomIndex];
        window.location.href = pageUrl;
      }, 3000);
    }
  
    function calculateSimilarity(shapePath, path) {
      const numPoints = Math.min(shapePath.length, path.length);
      let numMatched = 0;
  
      for (let i = 0; i < numPoints; i++) {
        const shapePoint = shapePath[i];
        const pathPoint = path[i];
        const distance = Math.sqrt((shapePoint.x - pathPoint.x) ** 2 + (shapePoint.y - pathPoint.y) ** 2);
  
        if (distance <= 10) {
          numMatched++;
        }
      }
  
      return numMatched / numPoints;
    }
  
    function displayResult(result) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "black";
      context.font = "40px Arial";
      context.fillText(result, canvas.width / 2 - 100, canvas.height / 2);
    }
  
    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the text "TRACE THE SHAPE!!" at the top
      context.fillStyle = "black";
      context.font = "24px Arial";
      context.fillText("TRACE THE SHAPE!!", 10, 30);
  
      // Draw the shape path
      context.beginPath();
      context.moveTo(shapePath[0].x, shapePath[0].y);
      for (let i = 1; i < shapePath.length; i++) {
        context.lineTo(shapePath[i].x, shapePath[i].y);
      }
      context.strokeStyle = "black";
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
  
      // Draw the user's path
      context.beginPath();
      context.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        context.lineTo(path[i].x, path[i].y);
      }
      context.strokeStyle = "red";
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    }
  
    // Countdown Timer
    let timeRemaining = timeLimit;
    const timerElement = document.getElementById("timer");
    timerElement.textContent = timeRemaining;
  
    function updateTimer() {
      timeRemaining--;
      timerElement.textContent = timeRemaining;
  
      if (timeRemaining <= 0) {
        gameover = true;
        displayResult("You Lose!");
      } else {
        setTimeout(updateTimer, 1000); // Update timer every second (1000 milliseconds)
      }
    }

    startButton.addEventListener('click', function () {
      overlay.style.display = 'none';
      draw();
    });
  
    setTimeout(updateTimer, 1000); // Start the timer
  });