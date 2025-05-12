/**
 * Main application script - initializes the game and handles the responsive canvas
 */

// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  // Create and start the game
  const game = new Game();
  game.start();
  
  // Handle window resize to adjust the canvas size
  window.addEventListener('resize', () => {
    // Adjust canvas size based on container dimensions
    const gameArea = document.querySelector('.game-area');
    const canvas = document.getElementById('game-canvas');
    
    if (gameArea && canvas) {
      // Keep the aspect ratio and grid alignment
      const borderWidth = 35;
      const availableWidth = gameArea.clientWidth - (borderWidth * 2);
      const availableHeight = gameArea.clientHeight - (borderWidth * 2);
      
      // Adjust canvas dimensions if needed
      if (canvas.width !== availableWidth || canvas.height !== availableHeight) {
        canvas.width = availableWidth;
        canvas.height = availableHeight;
        
        // Recreate the game with new dimensions
        const newGame = new Game();
        newGame.start();
      }
    }
  });
  
  // Add touch controls for mobile devices
  if ('ontouchstart' in window) {
    let startX, startY;
    
    document.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
      if (!startX || !startY) return;
      
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      
      const diffX = startX - currentX;
      const diffY = startY - currentY;
      
      // Determine the direction based on which axis had a larger change
      if (Math.abs(diffX) > Math.abs(diffY)) {
        // Horizontal swipe
        if (diffX > 0) {
          // Swipe left
          game.snake.changeDirection('left');
        } else {
          // Swipe right
          game.snake.changeDirection('right');
        }
      } else {
        // Vertical swipe
        if (diffY > 0) {
          // Swipe up
          game.snake.changeDirection('up');
        } else {
          // Swipe down
          game.snake.changeDirection('down');
        }
      }
      
      // Reset start position
      startX = null;
      startY = null;
      
      // Prevent scrolling
      e.preventDefault();
    });
  }
  
  // Add binary matrix animation to the background
  const backgroundAnimation = document.querySelector('.background-animation');
  
  if (backgroundAnimation) {
    // Create and append matrix characters
    const characters = '01';
    const columns = Math.floor(window.innerWidth / 20);
    const drops = [];
    
    // Initialize the drops at random positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -10);
    }
    
    // Create canvas for matrix rain
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixCanvas.style.position = 'absolute';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.zIndex = '-1';
    matrixCanvas.style.opacity = '0.1';
    
    backgroundAnimation.appendChild(matrixCanvas);
    
    const matrixCtx = matrixCanvas.getContext('2d');
    
    // Draw the matrix rain animation
    function drawMatrix() {
      // Set a semi-transparent background to create a fading effect
      matrixCtx.fillStyle = 'rgba(10, 10, 10, 0.1)';
      matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      
      // Set text color and font
      matrixCtx.fillStyle = '#00ff9d';
      matrixCtx.font = '15px monospace';
      
      // Draw each column of characters
      for (let i = 0; i < drops.length; i++) {
        // Choose a random character from the characters string
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        
        // Draw the character
        matrixCtx.fillText(text, i * 20, drops[i] * 20);
        
        // Move the drop down
        if (drops[i] * 20 > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        drops[i]++;
      }
    }
    
    // Run the matrix animation
    setInterval(drawMatrix, 100);
    
    // Handle window resize for the matrix animation
    window.addEventListener('resize', () => {
      matrixCanvas.width = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
      
      // Reset the drops based on the new width
      const newColumns = Math.floor(window.innerWidth / 20);
      for (let i = 0; i < newColumns; i++) {
        drops[i] = drops[i] || Math.floor(Math.random() * -10);
      }
    });
  }
});