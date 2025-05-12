/**
 * Utility functions for the Snake game
 */

// Generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if two positions collide
function checkCollision(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y;
}

// Convert a position to canvas coordinates
function posToCanvas(pos, cellSize) {
  return {
    x: pos.x * cellSize,
    y: pos.y * cellSize
  };
}

// Check if a position is within the grid boundaries
function isWithinBounds(pos, gridWidth, gridHeight) {
  return pos.x >= 0 && pos.x < gridWidth && pos.y >= 0 && pos.y < gridHeight;
}

// Load and store the high score using localStorage
function loadHighScore() {
  const storedHighScore = localStorage.getItem('snakeHighScore');
  return storedHighScore ? parseInt(storedHighScore, 10) : 0;
}

function saveHighScore(score) {
  const currentHighScore = loadHighScore();
  if (score > currentHighScore) {
    localStorage.setItem('snakeHighScore', score.toString());
    return true;
  }
  return false;
}

// Draw a rounded rectangle on the canvas
function drawRoundedRect(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
  ctx.fill();
}

// Create a glowing effect
function drawGlow(ctx, x, y, width, height, color, blurAmount = 10) {
  ctx.shadowColor = color;
  ctx.shadowBlur = blurAmount;
  ctx.fillRect(x, y, width, height);
  ctx.shadowBlur = 0;
}