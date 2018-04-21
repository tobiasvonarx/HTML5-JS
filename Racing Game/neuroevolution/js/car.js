const carGasRate = 0.05;
const carBrakeRate = 0.10;
const carTurnRate = 0.05;
const speedDecay = 0.988; // percent
const minSpeedToTurn = 0.3;

function carClass() {
	this.x;
	this.y;
	this.ang;
	this.speed;

	this.imageBrake;
	this.imageIdle;

	// booleans for steering
	// this.keyHeldGas;
	// this.keyHeldBrakes;
	// this.keyHeldTurnLeft;
	// this.keyHeldTurnRight;

	// this.controlKeyGas;
	// this.controlKeyBrakes;
	// this.controlKeyTurnLeft;
	// this.controlKeyTurnRight;

	this.moved;
	this.time;
	this.name

	this.finishLineReached;
	this.waymarkReached;

	this.brain = new NeuralNetwork(4, 16, 4);
	/*
	this.setupKeys = function(keyGas,keyBrakes,keyTurnLeft,keyTurnRight){
		this.controlKeyGas = keyGas;
		this.controlKeyBrakes = keyBrakes;
		this.controlKeyTurnLeft = keyTurnLeft;
		this.controlKeyTurnRight = keyTurnRight;
	}*/

	this.reset = function(startTile, carImageBrake, carImageIdle, name) {
		this.name = name

		//booleans for steering
		// this.keyHeldGas = false;
		// this.keyHeldBrakes = false;
		// this.keyHeldTurnLeft = false;
		// this.keyHeldTurnRight = false;

		this.waymarkReached = false;
		this.finishLineReached = false;

		this.imageBrake = carImageBrake;
		this.imageIdle = carImageIdle;
		this.ang = Math.radians(270);
		this.speed = 0;
		this.moved = false;
		this.time = 0;

		for (var eachRow = 0; eachRow < trackRows; eachRow++) { //two for loops to iterate through drawing the cols and rows
			for (var eachCol = 0; eachCol < trackCols; eachCol++) { //eachRow and eachCol are the loop variables

				var arrayIndex = rowColToArrayIndex(eachCol, eachRow); //make a variable to map all tracks to an index

				if (trackGrid[arrayIndex] == startTile) { //spawn-point
					this.x = (eachCol * trackSize) + (trackSize / 2);
					this.y = (eachRow * trackSize) + (trackSize / 2);
				}
			}
		}
	}

	this.move = function() {
		if (!finishLineReached) {
			this.time += 0.0333333;
		}

		var frontDistToWall;
		var leftDistToWall;
		var rightDistToWall;
		var backDistToWall;

		var interval = 40;

		//find polar coords at length of increment "interval" in all 4 directions until hitting
		//the wall, then the distance in amount of "intervals" = dist to corresponding wall
		var xFront = interval * Math.cos(Math.radians(this.ang + 270)) + this.x;
		var yFront = interval * Math.sin(Math.radians(this.ang + 270)) + this.y;
		var xBack = interval * Math.cos(Math.radians(this.ang + 90)) + this.x;
		var yBack = interval * Math.sin(Math.radians(this.ang + 90)) + this.y;
		var xLeft = interval * Math.cos(Math.radians(this.ang + 180)) + this.x;
		var yLeft = interval * Math.sin(Math.radians(this.ang + 180)) + this.y;
		var xRight = interval * Math.cos(Math.radians(this.ang)) + this.x;
		var yRight = interval * Math.sin(Math.radians(this.ang)) + this.y;
		var rowFront = Math.floor(yFront / trackSize);
		var colFront = Math.floor(xFront / trackSize);
		var rowBack = Math.floor(yBack / trackSize);
		var colBack = Math.floor(xBack / trackSize);
		var rowLeft = Math.floor(yLeft / trackSize);
		var colLeft = Math.floor(xLeft / trackSize);
		var rowRight = Math.floor(yRight / trackSize);
		var colRight = Math.floor(xRight / trackSize);
		var tileFront = returnTileTypeAtColRow(colFront, rowFront);
		var tileBack = returnTileTypeAtColRow(colBack, rowBack);
		var tileLeft = returnTileTypeAtColRow(colLeft, rowLeft);
		var tileRight = returnTileTypeAtColRow(colRight, rowRight);
		// console.log('Front',tileFront, rowFront, colFront);
		// console.log('Back', tileBack, rowBack, colBack);
		colorRect(xFront, yFront, 5, 5, 'purple');
		drawText(tileFront, xFront, yFront, 'black')
		colorRect(xBack, yBack, 5, 5, 'red');
		drawText(tileBack, xBack, yBack, 'black')
		colorRect(xLeft, yLeft, 5, 5, 'blue');
		drawText(tileLeft, xLeft, yLeft, 'black')
		colorRect(xRight, yRight, 5, 5, 'white');
		drawText(tileRight, xRight, yRight, 'black')
		// this.speed += carGasRate;


		if (this.keyHeldGas) { //executed every frame the up arrow is held
			this.speed += carGasRate;
		}
		if (this.keyHeldBrakes) {
			this.speed -= carBrakeRate;
		}
		if (Math.abs(this.speed) > minSpeedToTurn) {
			if (this.keyHeldTurnLeft) {
				this.ang -= carTurnRate;
			}
			if (this.keyHeldTurnRight) {
				this.ang += carTurnRate;
			}
		}
		if (!this.keyHeldGas) {
			this.speed *= speedDecay;
		}

		this.x += Math.cos(this.ang) * this.speed; //move car
		this.y += Math.sin(this.ang) * this.speed;

		carTrackHandling(this);

	}

	this.draw = function() {
		if (this.keyHeldBrakes) { //if car is braking
			drawPicWithRotation(this.imageBrake, this.x, this.y, this.ang);
		} else {
			drawPicWithRotation(this.imageIdle, this.x, this.y, this.ang);
		}
	}

}