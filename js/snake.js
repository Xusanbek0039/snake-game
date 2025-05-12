/**
 * Snake class - handles the snake's properties and movement
 */
class Snake {
  constructor(gridWidth, gridHeight) {
    // Initialize the snake with three segments at the center of the grid
    const centerX = Math.floor(gridWidth / 2);
    const centerY = Math.floor(gridHeight / 2);
    
    this.segments = [
      { x: centerX, y: centerY },       // Head
      { x: centerX - 1, y: centerY },   // Body
      { x: centerX - 2, y: centerY }    // Tail
    ];
    
    // Initial direction (right)
    this.direction = 'right';
    this.nextDirection = 'right';
    
    // Track if the snake has just eaten food
    this.justAte = false;
    
    // Store grid dimensions for boundary checking
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
  }
  
  /**
   * Update the snake's position based on its direction
   */
  update() {
    // Set the current direction to the next direction
    this.direction = this.nextDirection;
    
    // Get the current head position
    const head = { ...this.segments[0] };
    
    // Calculate the new head position based on direction
    switch (this.direction) {
      case 'up':
        head.y -= 1;
        break;
      case 'down':
        head.y += 1;
        break;
      case 'left':
        head.x -= 1;
        break;
      case 'right':
        head.x += 1;
        break;
    }
    
    // Add the new head to the beginning of the segments array
    this.segments.unshift(head);
    
    // If the snake didn't just eat food, remove the last segment
    // Otherwise, reset the justAte flag for the next update
    if (!this.justAte) {
      this.segments.pop();
    } else {
      this.justAte = false;
    }
    
    return head;
  }
  
  /**
   * Change the snake's direction
   * @param {string} newDirection - The new direction ('up', 'down', 'left', 'right')
   */
  changeDirection(newDirection) {
    // Prevent 180-degree turns (e.g., can't go left if currently moving right)
    if (
      (this.direction === 'up' && newDirection === 'down') ||
      (this.direction === 'down' && newDirection === 'up') ||
      (this.direction === 'left' && newDirection === 'right') ||
      (this.direction === 'right' && newDirection === 'left')
    ) {
      return;
    }
    
    this.nextDirection = newDirection;
  }
  
  /**
   * Check if the snake has collided with itself or the walls
   * @returns {boolean} - True if a collision occurred, false otherwise
   */
  checkCollision() {
    const head = this.segments[0];
    
    // Check wall collision
    if (
      head.x < 0 || 
      head.x >= this.gridWidth || 
      head.y < 0 || 
      head.y >= this.gridHeight
    ) {
      return true;
    }
    
    // Check self collision - start from the 4th segment
    // (snake can't collide with its first 3 segments)
    for (let i = 4; i < this.segments.length; i++) {
      if (checkCollision(head, this.segments[i])) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Check if the snake's head is at the food position
   * @param {Object} food - The food object with x and y coordinates
   * @returns {boolean} - True if the snake has eaten the food, false otherwise
   */
  eat(food) {
    const head = this.segments[0];
    
    if (checkCollision(head, food.position)) {
      this.justAte = true;
      return true;
    }
    
    return false;
  }
  
  /**
   * Draw the snake on the canvas
   * @param {CanvasRenderingContext2D} ctx - The canvas context
   * @param {number} cellSize - The size of each cell in pixels
   */
  draw(ctx, cellSize) {
    const radius = cellSize / 3;
    
    // Draw each segment of the snake
    this.segments.forEach((segment, index) => {
      const { x, y } = posToCanvas(segment, cellSize);
      
      // Head has a different color and glow effect
      if (index === 0) {
        // Glow effect for the head
        ctx.save();
        drawGlow(ctx, x, y, cellSize, cellSize, '#00ff9d', 15);
        ctx.restore();
        
        drawRoundedRect(ctx, x, y, cellSize, cellSize, radius, '#00ff9d');
        
        // Draw eyes
        const eyeSize = cellSize / 5;
        const eyeOffset = cellSize / 4;
        
        ctx.fillStyle = '#000';
        
        // Position eyes based on direction
        if (this.direction === 'right') {
          ctx.fillRect(x + cellSize - eyeOffset, y + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(x + cellSize - eyeOffset, y + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.direction === 'left') {
          ctx.fillRect(x + eyeOffset - eyeSize, y + eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(x + eyeOffset - eyeSize, y + cellSize - eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.direction === 'up') {
          ctx.fillRect(x + eyeOffset, y + eyeOffset - eyeSize, eyeSize, eyeSize);
          ctx.fillRect(x + cellSize - eyeOffset - eyeSize, y + eyeOffset - eyeSize, eyeSize, eyeSize);
        } else if (this.direction === 'down') {
          ctx.fillRect(x + eyeOffset, y + cellSize - eyeOffset, eyeSize, eyeSize);
          ctx.fillRect(x + cellSize - eyeOffset - eyeSize, y + cellSize - eyeOffset, eyeSize, eyeSize);
        }
      } else {
        // Body segments with gradient color from head to tail
        const greenValue = Math.max(255 - (index * 8), 50);
        const color = `rgb(0, ${greenValue}, ${Math.min(157 + index * 3, 255)})`;
        
        drawRoundedRect(ctx, x, y, cellSize, cellSize, radius, color);
      }
    });
  }
}