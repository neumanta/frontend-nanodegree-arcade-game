
// Don't use hard-coded positional multipliers in forumulas
//      The following multipliers will be used to position
//      objects on the game board.

var GameSettings = function() {
    this.colMult = 101;
    this.rowMult = 83;
    this.maxCols = 4;    // Default 4
    this.maxRows = 5;    // Default 5 (TODO: needs work to fix the block layout for rows)

    this.canvasWidth = (this.maxCols + 1) * this.colMult; // 505;
    this.canvasHeight = (this.maxRows + 1) * this.rowMult + 108; // 606;

    this.spriteHeight = 101;
    this.spriteHeight = 171;
    this.enemyRowOffset = -20;
    this.playerRowOffset = -40;
    this.collisionRadius = 1.8;

    this.movePoints = 10;
    this.goalPoints = 1000;
}
// Initialze the game settings for use
gameSettings = new GameSettings();

var GameChar = function(imageFile) {
    // Template for game character
    this.width = gameSettings.spriteHeight / gameSettings.collisionRadius;
    this.height = gameSettings.spriteHeight / gameSettings.collisionRadius;

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
    if (this.x > gameSettings.canvasWidth) {
        this.x = gameSettings.colMult * -1;
        this.reset();
    }

    // Now determinen the new column
    this.col = parseInt(this.x / gameSettings.colMult);
//    console.log("Enemy/Player col, row: " 
//        + this.col + "/" + player.col + " "
//        + this.row + "/" + player.row);
}

// Create a random row for the Enemy
Enemy.prototype.reset = function() {
    this.col = -1;
    this.x = this.col * gameSettings.colMult; // Always start offscreen

    this.row = (Math.floor(Math.random() * (gameSettings.maxRows - 2)) + 1);
    this.y = this.row * gameSettings.rowMult + gameSettings.enemyRowOffset;   // Always start at leas 1 row down.
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

    this.col = parseInt(gameSettings.maxCols/2);
    this.row = gameSettings.maxRows;

    this.moving = false;    // True when player is animating to new position
    this.destX = 0;
    this.destY = 0;
    this.speedX = 150;
    this.speedY = 150;

    this.moveToCol = -1;
    this.moveToRow = -1;
    this.lastKeyCode = '';

    this.lives = 5;
    this.level = 1;
    this.score = 0;

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


        // Check to see if player has reached the goal
        if (this.y <= 1 ) {
            if (this.exitCol == this.col) {
                this.level++;
                this.updateScore(gameSettings.goalPoints);
                console.log("Completed level");
                player.reset();
            } else {
                // Not a valid exit row, lose a life!
                this.loseLife();
            }
            console.log("Goal: y=" + this.y + " exitCol=" + this.exitCol
                            + " col=" + this.col
                            + " destCol=" + this.destRow);
        } else if (!this.moving) {
            // Move complete, add to the score
            this.updateScore(gameSettings.movePoints);
        }



    }

}
Player.prototype.updateScore = function (newPoints) {
    this.score += newPoints;
    console.log("New Score: " + this.score);
}
Player.prototype.loseLife = function() {
    this.lives--;
    console.log("Life lost: " + this.lives + " remaining.");
    this.reset();
}

Player.prototype.reset = function() {
    // Reset to the start position for player
    this.col = parseInt(gameSettings.maxCols/2);
    this.row = gameSettings.maxRows - 1;
    this.x = this.col * gameSettings.colMult;
    this.y = (this.row * gameSettings.rowMult) + gameSettings.playerRowOffset;
    this.moving = false;
    this.exitCol = Math.floor(Math.random() * (gameSettings.maxCols + 1)); // Setup the exit path
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
                if (this.row > 0) {
                    this.row--;
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }
                break;
            case 'right': // Right
                if (this.col < gameSettings.maxCols) {
                    this.col++;
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }
                break;
            case 'down': // Down
                if (this.row < gameSettings.maxRows - 1) {
                    this.row++;
                    this.moving = true;
                    this.lastKeyCode = keyCode;
                }
                break;
            default:
                this.moving = false;
        }
    

        if (this.moving) {
            this.destX = this.col * gameSettings.colMult;
            this.destY = (this.row * gameSettings.rowMult) + gameSettings.playerRowOffset;
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
