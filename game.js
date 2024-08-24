const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 40;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;

let player = { x: 0, y: 0 };
let shadow = { x: cols - 1, y: rows - 1 };
let balls = [];
let gameOver = false;

function createBalls() {
    balls = [];
    for (let i = 0; i < 5; i++) { // Reduzimos para 5 bolas para simplificar
        let ball;
        do {
            ball = {
                x: Math.floor(Math.random() * cols),
                y: Math.floor(Math.random() * rows)
            };
        } while ((ball.x === player.x && ball.y === player.y) || (ball.x === shadow.x && ball.y === shadow.y) || balls.some(b => b.x === ball.x && b.y === ball.y));
        balls.push(ball);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);

    ctx.fillStyle = 'red';
    ctx.fillRect(shadow.x * cellSize, shadow.y * cellSize, cellSize, cellSize);

    ctx.fillStyle = 'yellow';
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x * cellSize + cellSize / 2, ball.y * cellSize + cellSize / 2, cellSize / 4, 0, 2 * Math.PI);
        ctx.fill();
    });

    if (gameOver) {
        document.getElementById('endScreen').classList.remove('hidden');
    }
}

function movePlayer(dx, dy) {
    if (gameOver) return;

    const newX = player.x + dx;
    const newY = player.y + dy;

    if (newX >= 0 && newX < cols && newY >= 0 && newY < rows) {
        player.x = newX;
        player.y = newY;
        checkCollisions();
        draw();
    }
}

function moveShadow() {
    if (gameOver) return;

    const dx = Math.sign(player.x - shadow.x);
    const dy = Math.sign(player.y - shadow.y);

    shadow.x += dx;
    shadow.y += dy;

    if (shadow.x < 0) shadow.x = 0;
    if (shadow.x >= cols) shadow.x = cols - 1;
    if (shadow.y < 0) shadow.y = 0;
    if (shadow.y >= rows) shadow.y = rows - 1;

    if (shadow.x === player.x && shadow.y === player.y) {
        gameOver = true;
        document.getElementById('endMessage').innerText = 'Game Over! A sombra te pegou.';
        document.getElementById('endScreen').classList.remove('hidden');
    }

    draw();
}

function checkCollisions() {
    balls = balls.filter(ball => ball.x !== player.x || ball.y !== player.y);

    if (balls.length === 0) {
        gameOver = true;
        document.getElementById('endMessage').innerText = 'Você ganhou! Coletou todas as bolinhas.';
        document.getElementById('endScreen').classList.remove('hidden');
    }
}

function setup() {
    createBalls();
    draw();
    setInterval(moveShadow, 1000); // Ajustado para mover a sombra a cada segundo
}

document.addEventListener('keydown', (e) => {
    if (gameOver) return;
    
    switch (e.key) {
        case 'ArrowUp': movePlayer(0, -1); break;
        case 'ArrowDown': movePlayer(0, 1); break;
        case 'ArrowLeft': movePlayer(-1, 0); break;
        case 'ArrowRight': movePlayer(1, 0); break;
    }
});

document.getElementById('retryButton').addEventListener('click', () => {
    document.getElementById('endScreen').classList.add('hidden');
    player = { x: 0, y: 0 };
    shadow = { x: cols - 1, y: rows - 1 };
    gameOver = false;
    createBalls();
    draw();
});

setup();
