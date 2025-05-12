/**
 * Food class - handles the food generation and rendering
 */
class Food {
  constructor(gridWidth, gridHeight, snake) {
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    this.snake = snake;
    this.position = this.generatePosition();
    
    // Animation values
    this.pulseValue = 0;
    this.pulseDirection = 1;
    this.maxPulse = 1.2;
    this.minPulse = 0.8;
    this.pulseSpeed = 0.03;
  }
  
  /**
   * Generate a new random position for the food
   * that isn't occupied by the snake
   */
  generatePosition() {
    let newPosition;
    let positionValid = false;
    
    // Keep generating positions until we find one that doesn't overlap with the snake
    while (!positionValid) {
      newPosition = {
        x: getRandomInt(0, this.gridWidth - 1),
        y: getRandomInt(0, this.gridHeight - 1)
      };
      
      positionValid = true;
      
      // Check if the position overlaps with any snake segment
      for (const segment of this.snake.segments) {
        if (checkCollision(newPosition, segment)) {
          positionValid = false;
          break;
        }
      }
    }
    
    return newPosition;
  }
  
  /**
   * Update the food's animation state
   */
  update() {
    // Update pulse animation
    this.pulseValue += this.pulseDirection * this.pulseSpeed;
    
    if (this.pulseValue >= this.maxPulse) {
      this.pulseValue = this.maxPulse;
      this.pulseDirection = -1;
    } else if (this.pulseValue <= this.minPulse) {
      this.pulseValue = this.minPulse;
      this.pulseDirection = 1;
    }
  }
  
  /**
   * Draw the food on the canvas with a pulsing animation
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   * @param {number} cellSize - The size of each cell in pixels
   */
  draw(ctx, cellSize) {
    const { x, y } = posToCanvas(this.position, cellSize);
    
    // Calculate the center of the cell
    const centerX = x + cellSize / 2;
    const centerY = y + cellSize / 2;
    
    // Calculate the radius with pulse effect
    const radius = (cellSize / 2) * this.pulseValue;
    
    // Draw a pulsing circle with a glow effect
    ctx.save();
    
    // Create a glowing effect
    ctx.shadowColor = '#ff3c00';
    ctx.shadowBlur = 15;
    
    // Draw the food
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fillStyle = '#ff3c00';
    ctx.fill();
    
    // Add a highlight
    ctx.beginPath();
    ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fill();
    
    ctx.restore();
  }
}