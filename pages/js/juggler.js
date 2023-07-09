// Game variables
const ballRadius = 10;
const paddleWidth = 200;
const paddleHeight = 10;
const paddleColor = 0x00ff00;
const ballColor = 0xff4500;
const initialBallCount = 3;
const ballInterval = 10; // Time interval to add a new ball (in seconds)
const gameDuration = 45; // Game duration (in seconds)
const winText = "You Win!";
const loseText = "You Lose!";

const bounceEffect = new Audio('../pages/resources/bounce.mp3');
const missEffect = new Audio('../pages/resources/ball_miss.mp3');

let scene, camera, renderer;
let paddle, balls;
let lives, timer, gameEnded;
let statusText;

function init() {
    // Set up the scene, camera, and renderer
    scene = new THREE.Scene();

    // Create the skybox
    // doesnt work, will just replace with textures later
    let geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere to make the texture inside
    let skyColor = new THREE.Color(0x87ceeb); // Light blue color for the sky
    let material = new THREE.MeshBasicMaterial({ color: skyColor });
    let sky = new THREE.Mesh(geometry, material);
    scene.add(sky);

    camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
    );
    camera.position.z = 400;

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById("game-container").appendChild(renderer.domElement);

    // Set up game variables
    lives = initialBallCount;
    timer = gameDuration;
    gameEnded = false;

    // Create the paddle
    const paddleGeometry = new THREE.BoxGeometry(paddleWidth, paddleHeight, 10);
    const paddleMaterial = new THREE.MeshBasicMaterial({ color: paddleColor });
    paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    paddle.position.y = -250;
    scene.add(paddle);

    // Create the balls
    balls = [];
    createBall();

    // Set up a timer to create additional balls
    setTimeout(() => createBall(), 2000);
    setTimeout(() => createBall(), 4000);
    setTimeout(() => createBall(), 13000);
    setTimeout(() => createBall(), 23000);
    setTimeout(() => createBall(), 30000);
    setTimeout(() => createBall(), 37000);

    // Set up status text
    statusText = document.createElement("div");
    statusText.id = "status-text";
    document.body.appendChild(statusText);

    // Handle mouse movement
    document.addEventListener("mousemove", handleMouseMove);

    // Start the game loop
    animate();
}
  

function createBall() {
  const ballGeometry = new THREE.SphereGeometry(ballRadius, 32, 32);
  const ballMaterial = new THREE.MeshBasicMaterial({ color: ballColor });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  ball.position.x = Math.random() * (470 - (-465)) + (-465); // Adjusted x-axis range
  ball.position.y = 600;
  ball.velocity = new THREE.Vector2(0, 0);
  balls.push(ball);
  scene.add(ball);
}

function handleMouseMove(event) {
  const mousePosition = (event.clientX / window.innerWidth) * 2 - 1;
  paddle.position.x =
    mousePosition * (window.innerWidth / 2 - paddleWidth / 2);
}

function animate() {
  if (!gameEnded) {
    requestAnimationFrame(animate);
    update();
    renderer.render(scene, camera);
  }
}

function update() {
  // Move the balls
  for (let i = 0; i < balls.length; i++) {
    const ball = balls[i];
    ball.velocity.y -= 0.065; // Apply gravity

    // Update ball position
    ball.position.x += ball.velocity.x;
    ball.position.y += ball.velocity.y;

    // Check for collision with walls
    if (ball.position.x <= -465 || ball.position.x >= 470) {
      ball.velocity.x *= -1; // Reverse x-axis velocity
    }

    // Check for collision with paddle
    if (
        ball.position.y - ballRadius <= paddle.position.y + paddleHeight / 2 &&
        ball.position.y - ballRadius >= paddle.position.y - paddleHeight / 2 &&
        ball.position.x >= paddle.position.x - paddleWidth / 2 &&
        ball.position.x <= paddle.position.x + paddleWidth / 2
    ) {
        bounceEffect.play();
        // Ball hit the paddle, bounce it back upwards
        ball.position.y = paddle.position.y + paddleHeight / 2 + ballRadius;
        ball.velocity.y *= -1;
        ball.velocity.x += (Math.random() * 1) - 0.5;
    }
         

    // Check for collision with other balls
    for (let j = i + 1; j < balls.length; j++) {
      const otherBall = balls[j];
      if (areBallsColliding(ball, otherBall)) {
        // Balls collide, transfer velocities
        const tempX = ball.velocity.x;
        const tempY = ball.velocity.y;
        ball.velocity.x = otherBall.velocity.x;
        ball.velocity.y = otherBall.velocity.y;
        otherBall.velocity.x = tempX;
        otherBall.velocity.y = tempY;
      }
    }

    // Check if the ball fell below the paddle
    if (ball.position.y - ballRadius < -250) {
        missEffect.play();
      scene.remove(ball);
      balls.splice(i, 1);
      lives--;

      // Check for game over condition
      if (lives === 0) {
        endGame(loseText);
        break;
      }
    }
  }

  document.getElementById('timerText').textContent = `Timer: ${Math.floor(timer)}`;
  document.getElementById('lifeText').textContent = `Life: ${Math.floor(lives)}`;
  // Update the game timer
  timer -= 1 / 60; // Assuming 60 frames per second
  if (timer <= 0) {
    endGame(lives > 0 ? winText : loseText);
  }

  // Add a new ball every ballInterval seconds
  if (Math.floor(timer) % ballInterval === 0 && timer % 1 === 0) {
    createBall();
  }
}

function areBallsColliding(ball1, ball2) {
  const distance = ball1.position.distanceTo(ball2.position);
  return distance <= ballRadius * 2;
}

function endGame(text) {
  gameEnded = true;
  statusText.textContent = text;
  statusText.style.display = "block";
}

init();
