const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const cellSize = 20;
const rows = canvas.height / cellSize;
const cols = canvas.width / cellSize;
let player = { x: 1, y: 1 };
let shadow = { x: cols - 2, y: rows - 2 };
let score = 0;
const gameOverElement = document.createElement('div');
gameOverElement.id = 'gameOver';
gameOverElement.textContent = 'GAME OVER';
document.body.appendChild(gameOverElement);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'yellow';
  ctx.fillRect(player.x * cellSize, player.y * cellSize, cellSize, cellSize);
  ctx.fillStyle = 'gray';
  ctx.fillRect(shadow.x * cellSize, shadow.y * cellSize, cellSize, cellSize);
}

function update() {
  shadow.x += (player.x > shadow.x) ? 1 : -1;
  shadow.y += (player.y > shadow.y) ? 1 : -1;
  if (shadow.x === player.x && shadow.y === player.y) {
    gameOverElement.style.display = 'block';
    document.removeEventListener('keydown', handleKeyPress);
  }
  draw();
}

function handleKeyPress(e) {
  switch (e.key) {
    case 'ArrowUp': player.y = Math.max(0, player.y - 1); break;
    case 'ArrowDown': player.y = Math.min(rows - 1, player.y + 1); break;
    case 'ArrowLeft': player.x = Math.max(0, player.x - 1); break;
    case 'ArrowRight': player.x = Math.min(cols - 1, player.x + 1); break;
  }
  update();
}

document.addEventListener('keydown', handleKeyPress);
draw();
