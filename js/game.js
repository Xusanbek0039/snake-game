/**
 * Game class - manages the game state, rendering, and input
 */
class Game {
  constructor() {
    // Get the canvas element and its context
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');
    
    // Set the canvas dimensions
    this.canvas.width = 500 - 70; // Account for the border
    this.canvas.height = 400 - 70;
    
    // Game configuration
    this.cellSize = 20;
    this.gridWidth = Math.floor(this.canvas.width / this.cellSize);
    this.gridHeight = Math.floor(this.canvas.height / this.cellSize);
    
    // Initialize game objects
    this.snake = new Snake(this.gridWidth, this.gridHeight);
    this.food = new Food(this.gridWidth, this.gridHeight, this.snake);
    
    // Game state
    this.score = 0;
    this.highScore = loadHighScore();
    this.gameOver = false;
    this.animationFrameId = null;
    this.lastUpdateTime = 0;
    this.updateInterval = 150; // milliseconds between updates (controls game speed)
    
    // Display the high score
    document.getElementById('high-score').textContent = this.highScore;
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Set up keyboard event listeners for controlling the snake
   */
  setupEventListeners() {
    // Arrow key controls
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case 'ArrowUp':
          this.snake.changeDirection('up');
          event.preventDefault();
          break;
        case 'ArrowDown':
          this.snake.changeDirection('down');
          event.preventDefault();
          break;
        case 'ArrowLeft':
          this.snake.changeDirection('left');
          event.preventDefault();
          break;
        case 'ArrowRight':
          this.snake.changeDirection('right');
          event.preventDefault();
          break;
      }
    });
    
    // Restart button click event
    document.getElementById('restart-button').addEventListener('click', () => {
      this.restart();
    });
  }
  
  /**
   * Start the game loop
   */
  start() {
    // Reset game state if restarting
    if (this.gameOver) {
      this.restart();
      return;
    }
    
    // Start the game loop
    this.gameLoop(0);
  }
  
  /**
   * Main game loop
   * @param {number} timestamp - The current timestamp
   */
  gameLoop(timestamp) {
    // Calculate time since last update
    const elapsed = timestamp - this.lastUpdateTime;
    
    // Update game state if enough time has passed
    if (elapsed > this.updateInterval) {
      this.update();
      this.lastUpdateTime = timestamp;
    }
    
    // Always render at full frame rate
    this.render();
    
    // Continue the game loop if not game over
    if (!this.gameOver) {
      this.animationFrameId = requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
  }
  
  /**
   * Update the game state
   */
  update() {
    // Skip updates if game is over
    if (this.gameOver) return;
    
    // Update snake position
    this.snake.update();
    
    // Check if snake ate food
    if (this.snake.eat(this.food)) {
      // Generate new food position
      this.food = new Food(this.gridWidth, this.gridHeight, this.snake);
      
      // Increase score
      this.score += 10;
      document.getElementById('score').textContent = this.score;
      
      // Speed up the game slightly as the score increases
      this.updateInterval = Math.max(60, 150 - Math.floor(this.score / 50) * 5);
    }
    
    // Update food animation
    this.food.update();
    
    // Check for collisions
    if (this.snake.checkCollision()) {
      this.handleGameOver();
    }
  }
  
  /**
   * Render the game state
   */
  render() {
    // Clear the canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw grid lines (subtle)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 0.5;
    
    // Draw vertical grid lines
    for (let x = 0; x <= this.gridWidth; x++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x * this.cellSize, 0);
      this.ctx.lineTo(x * this.cellSize, this.canvas.height);
      this.ctx.stroke();
    }
    
    // Draw horizontal grid lines
    for (let y = 0; y <= this.gridHeight; y++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y * this.cellSize);
      this.ctx.lineTo(this.canvas.width, y * this.cellSize);
      this.ctx.stroke();
    }
    
    // Draw food and snake
    this.food.draw(this.ctx, this.cellSize);
    this.snake.draw(this.ctx, this.cellSize);
  }
  
  /**
   * Handle game over state
   */
  handleGameOver() {
    this.gameOver = true;
    
    // Check for high score
    if (this.score > this.highScore) {
      this.highScore = this.score;
      saveHighScore(this.highScore);
      document.getElementById('high-score').textContent = this.highScore;
    }
    
    // Update final score display
    document.getElementById('final-score').textContent = this.score;
    
    // Show game over screen
    document.getElementById('game-over').classList.remove('hidden');
    
    // Cancel animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
  }
  
  /**
   * Restart the game
   */
  restart() {
    // Hide game over screen
    document.getElementById('game-over').classList.add('hidden');
    
    // Reset game state
    this.snake = new Snake(this.gridWidth, this.gridHeight);
    this.food = new Food(this.gridWidth, this.gridHeight, this.snake);
    this.score = 0;
    this.gameOver = false;
    this.updateInterval = 150;
    
    // Reset score display
    document.getElementById('score').textContent = '0';
    
    // Start game loop again
    this.start();
  }
}