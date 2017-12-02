const PLAYER_MOVE_SPEED = 3.0;

function warriorClass() {
	this.x = 75;
	this.y = 75;
	this.myWarriorPic; // which picture to use
	this.name = "Untitled Warrior";
	this.keysHeld = 0;

	this.keyHeld_North = false;
	this.keyHeld_South = false;
	this.keyHeld_West = false;
	this.keyHeld_East = false;

	this.controlKeyUp;
	this.controlKeyRight;
	this.controlKeyDown;
	this.controlKeyLeft;

	this.setupInput = function(upKey, rightKey, downKey, leftKey) {
		this.controlKeyUp = upKey;
		this.controlKeyRight = rightKey;
		this.controlKeyDown = downKey;
		this.controlKeyLeft = leftKey;
	}

	this.reset = function(whichImage, warriorName) {
		this.name = warriorName;
		this.myWarriorPic = whichImage;
		this.keysHeld = 0;
		this.updateKeyReadout();

		for(var eachRow=0;eachRow<WORLD_ROWS;eachRow++) {
			for(var eachCol=0;eachCol<WORLD_COLS;eachCol++) {
				var arrayIndex = rowColToArrayIndex(eachCol, eachRow); 
				if(worldGrid[arrayIndex] == TILE_PLAYERSTART) {
					worldGrid[arrayIndex] = TILE_GROUND;
					this.x = eachCol * WORLD_W + WORLD_W/2;
					this.y = eachRow * WORLD_H + WORLD_H/2;
					return;
				} // end of player start if
			} // end of col for
		} // end of row for
		console.log("NO PLAYER START FOUND!");
	} // end of warriorReset func

	this.updateKeyReadout = function() {
		document.getElementById("debugText").innerHTML = "Keys: " + this.keysHeld;
	}

	this.move = function() {
		var nextX = this.x;
		var nextY = this.y;

		if(this.keyHeld_North) {
			nextY -= PLAYER_MOVE_SPEED;
		}
		if(this.keyHeld_East) {
			nextX += PLAYER_MOVE_SPEED;
		}
		if(this.keyHeld_South) {
			nextY += PLAYER_MOVE_SPEED;
		}
		if(this.keyHeld_West) {
			nextX -= PLAYER_MOVE_SPEED;
		}

		var walkIntoTileIndex = getTileIndexAtPixelCoord(nextX, nextY);
		var walkIntoTileType = TILE_WALL;

		if(walkIntoTileIndex != undefined) {
			walkIntoTileType = worldGrid[walkIntoTileIndex];
		}

		switch(walkIntoTileType) {
			case TILE_GROUND:
				this.x = nextX;
				this.y = nextY;
				break;
			case TILE_GOAL:
				console.log(this.name + " WINS!");
				loadLevel(levelOne);
				break;
			case TILE_DOOR:
				if(this.keysHeld > 0) {
					this.keysHeld--; // one less key
					this.updateKeyReadout();
					worldGrid[walkIntoTileIndex] = TILE_GROUND;
				}
				break;
			case TILE_KEY:
				this.keysHeld++; // one more key
				this.updateKeyReadout();
				worldGrid[walkIntoTileIndex] = TILE_GROUND;
				break;
			case TILE_WALL:
			default:
				break;
		}
	}

	this.draw = function() {
		drawBitmapCenteredWithRotation(this.myWarriorPic, this.x,this.y, 0);
	}
}