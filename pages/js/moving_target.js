document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("gameCanvas");
    const context = canvas.getContext("2d");
  
    // Set canvas dimensions to match the screen size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  
    let targetX = Math.random() * (canvas.width - 50); // Initial target position (x-coordinate)
    let targetY = Math.random() * (canvas.height - 50); // Initial target position (y-coordinate)
    const targetSize = 150; // Size of the target
    const numRings = 4; // Number of concentric rings in the target
  
    let score = 0; // Player's score
    let gameover = false; // Game over flag
    let timeLimit = 45; // Time limit in seconds
    let timeLeft = timeLimit; // Time left in seconds
  
    canvas.addEventListener("click", handleClick);
  
    let velocityX = (Math.random() - 0.5) * 2;
    let velocityY = (Math.random() - 0.5) * 2;
    const maxVelocity = 0.5; // Maximum velocity for smooth movement
  
    function draw() {
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      if (!gameover) {
        // Draw the target rings
        const ringColors = ["red", "white"];
        const ringWidth = targetSize / (numRings * 2);
  
        for (let i = 0; i < numRings; i++) {
          const ringRadius = (numRings - i) * ringWidth;
  
          context.beginPath();
          context.arc(targetX, targetY, ringRadius, 0, 2 * Math.PI);
          context.fillStyle = ringColors[i % 2];
          context.fill();
          context.closePath();
        }
  
        // Draw the bullseye
        const bullseyeRadius = ringWidth / 2;
  
        context.beginPath();
        context.arc(targetX, targetY, bullseyeRadius, 0, 2 * Math.PI);
        context.fillStyle = "black";
        context.fill();
        context.closePath();
      }
  
      // Display the score
      context.fillStyle = "black";
      context.font = "20px Arial";
      context.fillText("SHOOT THE TARGET!!", 10, 30);
      context.fillText("Score: " + score, 10, 60);
      // Draw timer
      context.fillText(`Time: ${Math.ceil(timeLeft)}`, 10, 90);
  
      // Display game over message
      if (gameover) {
        context.fillStyle = "black";
        context.font = "40px Arial";
        context.fillText(
          score >= 10 ? "You Win!" : "You Lose!",
          canvas.width / 2 - 100,
          canvas.height / 2
        );
        setTimeout(() => {
          const gamePages = ["trace", "fruit_catch", "samurai"];
          const randomIndex = Math.floor(Math.random() * gamePages.length);
          const pageUrl = gamePages[randomIndex];
          window.location.href = pageUrl;
        }, 3000);
      }
    }
  
    function update() {
      if (gameover) return;
  
      const speed = 20; // Adjust the speed of movement
  
      // Update the target's position based on the velocities
      targetX += velocityX * speed;
      targetY += velocityY * speed;
  
      // Check if the target has reached the boundaries
      const reachedBoundaryX =
        targetX < targetSize / 2 || targetX + targetSize / 2 > canvas.width - targetSize / 2;
      const reachedBoundaryY =
        targetY < targetSize / 2 || targetY + targetSize / 2 > canvas.height - targetSize / 2;
  
      if (reachedBoundaryX || reachedBoundaryY) {
        // Change the target's direction by generating new random velocities
        velocityX = (Math.random() - 0.5) * 2; // Random value between -1 and 1
        velocityY = (Math.random() - 0.5) * 2; // Random value between -1 and 1
      }
  
      // Make sure the target stays within the canvas boundaries
      targetX = Math.max(targetSize / 2, Math.min(targetX, canvas.width - targetSize / 2));
      targetY = Math.max(targetSize / 2, Math.min(targetY, canvas.height - targetSize / 2));
  
      // Update the time left
      timeLeft -= 1 / 60; // Assuming the game runs at 60 frames per second
  
      // Check if time is up
      if (timeLeft <= 0) {
        gameover = true;
      }
    }
  
    function handleClick(event) {
      if (gameover) return;
  
      const clickX = event.clientX - canvas.offsetLeft;
      const clickY = event.clientY - canvas.offsetTop;
  
      const distance = Math.sqrt((clickX - targetX) ** 2 + (clickY - targetY) ** 2);
  
      if (distance <= targetSize / 2) {
        score++;
      }
  
      if (timeLeft <= 0) {
        gameover = true;
      }
    }
  
    function gameLoop() {
      update();
      draw();
  
      requestAnimationFrame(gameLoop);
    }
  
    gameLoop();
  });
  