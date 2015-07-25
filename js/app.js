
// Don't use hard-coded positional multipliers in forumulas
//      The following multipliers will be used to position
//      objects on the game board.
var colMult = 101;
var rowMult = 83;
var maxCols = 4;    // Default 4
var maxRows = 5;    // Default 5 (TODO: needs work to fix the block layout for rows)

var canvasWidth = (maxCols + 1) * colMult; // 505;
var canvasHeight = (maxRows + 1) * rowMult + 108; // 606;

var spriteWidth = 101;
var spriteHeight = 171;
var EnemyRowOffset = -20;
var PlayerRowOffset = -40;
var collisionRadius = 1.8;

var GameChar = function(imageFile) {
    // Template for game character
    this.width = spriteWidth / collisionRadius;
    this.height = spriteHeight / collisionRadius;

    this.sprite = imageFile // Game Character Image
    this.exitSprite = 'images/grass-block.png';
    this.exitCol = 0;
}
// Draw the Game Character on the screen, required method for game
GameChar.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);    
}

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    GameChar.call(this, 'images/enemy-bug.png');
    this.reset();
}
Enemy.prototype = Object.create(GameChar.prototype);
Enemy.prototype.constructor = Enemy;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed * dt;
    if (this.x > canvasWidth) {
        this.x = colMult * -1;
        this.reset();
    }

    // Now determinen the new column
    this.col = parseInt(this.x / colMult);
//    console.log("Enemy/Player col, row: " 
//        + this.col + "/" + player.col + " "
//        + this.row + "/" + player.row);
}

// Create a random row for the Enemy
Enemy.prototype.reset = function() {
    this.col = -1;
    this.x = this.col * colMult; // Always start offscreen

    this.row = (Math.floor(Math.random() * (maxRows - 2)) + 1);
    this.y = this.row * rowMult + EnemyRowOffset;   // Always start at leas 1 row down.
    this.speed = ((Math.floor(Math.random() * 2.5) + 1) * 50) + 50;   // Offer up to 4 diff speeds
    // console.log("Reset Enemy x: " + this.x + " y: " + this.y + " speed:" + this.speed);



}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    GameChar.call(this, 'images/char-princess-girl.png');

    this.col = parseInt(maxCols/2);
    this.row = maxRows;

    this.moving = false;    // True when player is animating to new position
    this.destX = 0;
    this.destY = 0;
    this.speedX = 150;
    this.speedY = 150;

    this.moveToCol = -1;
    this.moveToRow = -1;
    this.lastKeyCode = '';

    this.reset();
}
Player.prototype = Object.create(GameChar.prototype);
Player.prototype.constructor = Player;

Player.prototype.update = function(dt) {
    // Move the player
    
    if (this.moving) {
        // player has moved determine new position

        if (this.x < this.destX) {
            this.x += this.speedX * dt;
            if (this.x > this.destX) { // Destination achieved
                this.x = this.destX;
                this.moving = false;
            }
        } else if (this.x > this.destX) {
            this.x -= this.speedX * dt;
            if (this.x < this.destX) { // Destination achieved
                this.x = this.destX;
                this.moving = false;
            }
        }

        if (this.y < this.destY) {
            this.y += this.speedY * dt;
            if (this.y > this.destY) { // Destination achieved
                this.y = this.destY;
                this.moving = false;
            }
        } else if (this.y > this.destY) {
            this.y -= this.speedY * dt;
            if (this.y < this.destY) { // Destination achieved
                this.y = this.destY;
                this.moving = false;
            }
        }   

    }

}
Player.prototype.reset = function() {
    // Reset to the start position for player
    this.col = parseInt(maxCols/2);
    this.row = maxRows;
    this.x = this.col * colMult;
    this.y = (this.row * rowMult) + PlayerRowOffset;
    this.moving = false;
    this.exitCol = Math.floor(Math.random() * (maxCols + 1)); // Setup the exit path
}

Player.prototype.handleInput = function(keyCode) {


    if (!this.moving || (this.moving && this.lastKeyCode !== keyCode)) {
        // Only check the movement keys if the player is NOT moving
        //      or has pressed a different key.
        //      This will allow the player to turn back quickly.
        // Otherwise there will be a buffer effect and will cause problems.
        console.log("keyCode: " + keyCode);
        switch (keyCode) {
            case 'left': // Left
                if (this.col > 0) {
                    this.col--;    
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }            
                break;
            case 'up': // Up
                if (this.row > 1) {
                    this.row--;
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }
                break;
            case 'right': // Right
                if (this.col < maxCols) {
                    this.col++;
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }
                break;
            case 'down': // Down
                if (this.row < maxRows) {
                    this.row++;
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }
                break;
            default:
                this.moving = false;
        }
    

        if (this.moving) {
            this.destX = this.col * colMult;
            this.destY = (this.row * rowMult) + PlayerRowOffset;
            console.log("Moving is true. New x,y:" + this.destX + ", " + this.destY
                        + " Current x,y: " + this.x + ", " + this.y);
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [enimy = new Enemy(), enimy = new Enemy()]
var player = new Player();


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
