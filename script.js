const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game Objects
const paddleWidth = 10;
const paddleHeight = 80;
const ballSize = 8;
const ballSpeed = 5;

let playerScore = 0;
let computerScore = 0;

// Player Paddle
const player = {
    x: 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 6
};

// Computer Paddle
const computer = {
    x: canvas.width - paddleWidth - 10,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    dy: 0,
    speed: 4
};

// Ball
let ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    dx: ballSpeed,
    dy: ballSpeed,
    size: ballSize
};

// Keyboard and Mouse Controls
const keys = {};
let mouseY = canvas.height / 2;

document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

document.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseY = e.clientY - rect.top;
});

// Move player paddle
function movePlayer() {
    // Arrow keys control
    if (keys['ArrowUp'] && player.y > 0) {
        player.y -= player.speed;
    }
    if (keys['ArrowDown'] && player.y < canvas.height - player.height) {
        player.y += player.speed;
    }
    
    // Mouse control
    const mouseSpeed = 7;
    if (mouseY < player.y - 10) {
        player.y -= mouseSpeed;
    } else if (mouseY > player.y + player.height + 10) {
        player.y += mouseSpeed;
    }
    
    // Keep player in bounds
    if (player.y < 0) player.y = 0;
    if (player.y > canvas.height - player.height) player.y = canvas.height - player.height;
}

// Move computer paddle (AI)
function moveComputer() {
    const computerCenter = computer.y + computer.height / 2;
    const ballCenter = ball.y;
    
    // Simple AI: follow the ball
    if (computerCenter < ballCenter - 35) {
        computer.y += computer.speed;
    } else if (computerCenter > ballCenter + 35) {
        computer.y -= computer.speed;
    }
    
    // Keep computer in bounds
    if (computer.y < 0) computer.y = 0;
    if (computer.y > canvas.height - computer.height) computer.y = canvas.height - computer.height;
}

// Move ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
    
    // Ball collision with top and bottom walls
    if (ball.y - ball.size < 0 || ball.y + ball.size > canvas.height) {
        ball.dy = -ball.dy;
        ball.y = ball.y - ball.size < 0 ? ball.size : canvas.height - ball.size;
    }
    
    // Ball collision with paddles
    if (
        ball.x - ball.size < player.x + player.width &&
        ball.y > player.y &&
        ball.y < player.y + player.height
    ) {
        ball.dx = -ball.dx;
        ball.x = player.x + player.width + ball.size;
        
        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (player.y + player.height / 2);
        ball.dy += deltaY * 0.05;
    }
    
    if (
        ball.x + ball.size > computer.x &&
        ball.y > computer.y &&
        ball.y < computer.y + computer.height
    ) {
        ball.dx = -ball.dx;
        ball.x = computer.x - ball.size;
        
        // Add spin based on where ball hits paddle
        const deltaY = ball.y - (computer.y + computer.height / 2);
        ball.dy += deltaY * 0.05;
    }
    
    // Ball out of bounds - scoring
    if (ball.x - ball.size < 0) {
        computerScore++;
        resetBall();
        document.getElementById('computerScore').textContent = computerScore;
    }
    
    if (ball.x + ball.size > canvas.width) {
        playerScore++;
        resetBall();
        document.getElementById('playerScore').textContent = playerScore;
    }
}

// Reset ball to center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = ballSpeed * (Math.random() > 0.5 ? 1 : -1);
}

// Draw functions
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawBall() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fill();
}

function drawCenterLine() {
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw center line
    drawCenterLine();
    
    // Draw game objects
    drawPaddle(player);
    drawPaddle(computer);
    drawBall();
}

// Main game loop
function gameLoop() {
    movePlayer();
    moveComputer();
    moveBall();
    draw();
    
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();