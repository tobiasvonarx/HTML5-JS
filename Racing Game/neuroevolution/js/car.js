const carGasRate = 0.05;
const carBrakeRate = 0.10;
const carTurnRate = 0.05;
const speedDecay = 0.988; // percent
const minSpeedToTurn = 0.3;

function mutate(x) {
	if (Math.random(1) < 0.1) {
		// let offset = randomGaussian() * 0.5;
		let offset = (Math.random()*2-1)/2;
		let newx = x + offset;
		return newx;
	} else {
		return x;
	}
}

function carClass(brain) {
	this.x;
	this.y;
	this.w = 100;
	this.h = 60;
	this.ang;
	this.speed;
	this.score;

	this.imageBrake;
	this.imageIdle;
	this.positionIndexes;

	if (brain instanceof NeuralNetwork) {
		this.brain = brain.copy();
		this.brain.mutate(mutate);
	} else {
		this.brain = new NeuralNetwork(5, 25, 4);
	}

	// booleans for steering
	// this.keyHeldGas;
	// this.keyHeldBrakes;
	// this.keyHeldTurnLeft;
	// this.keyHeldTurnRight;

	// this.controlKeyGas;
	// this.controlKeyBrakes;
	// this.controlKeyTurnLeft;
	// this.controlKeyTurnRight;

	this.time;
	this.name

	this.finishLineReached;
	this.waymarkReached;

	// this.brain = new NeuralNetwork(5, 25, 4);

	/*
	this.setupKeys = function(keyGas,keyBrakes,keyTurnLeft,keyTurnRight){
		this.controlKeyGas = keyGas;
		this.controlKeyBrakes = keyBrakes;
		this.controlKeyTurnLeft = keyTurnLeft;
		this.controlKeyTurnRight = keyTurnRight;
	}*/

	this.reset = function(startTile, carImageBrake, carImageIdle, name) {
		this.name = name;
		this.positionIndexes = [];
		this.score = 200;

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
		this.time = 0;

		for (var eachRow = 0; eachRow < trackRows; eachRow++) { //two for loops to iterate through drawing the cols and rows
			for (var eachCol = 0; eachCol < trackCols; eachCol++) { //eachRow and eachCol are the loop variables

				var arrayIndex = colRowToArrayIndex(eachCol, eachRow); //make a variable to map all tracks to an index

				if (trackGrid[arrayIndex] == startTile) { //spawn-point
					this.x = (eachCol * trackSize) + (trackSize / 2);
					this.y = (eachRow * trackSize) + (trackSize / 2);
				}
			}
		}
	}

	this.copy = function() {
		return new carClass(this.brain);
	}

	this.setPreviousPositions = function(index, tile) {
		if (!this.positionIndexes.includes(index) && tile == roadTile) {
			this.positionIndexes.push(index);
			this.score += 60;
		}
	}

	this.move = function() {
		if (!finishLineReached) {
			this.time += 0.0333333;
			this.score -= 1;
		}

		// if (this.score < 0) {
		// 	cars.remove(this);
		// }

		var frontDistToWall;
		var foundFrontDist = false;
		var leftDistToWall;
		var foundLeftDist = false;
		var rightDistToWall;
		var foundRightDist = false;
		var backDistToWall;
		var foundBackDist = false;

		// x = eachCol*trackSize + trackSize/2
		// eachCol*trackSize = x - trackSize/2
		// eachCol = x/trackSize - 1/2

		var col = Math.round(this.x / trackSize - 0.5);
		var row = Math.round(this.y / trackSize - 0.5);
		//console.log(row);
		var tile = returnTileTypeAtColRow(col, row);
		//console.log(tile);

		for (frontDistToWall = 1; foundFrontDist != true; frontDistToWall++) { // while distance to front wall not found
			var front = row - frontDistToWall;
			if (returnTileTypeAtColRow(col, front) != 0) { //found collision
				foundFrontDist = true;
				frontDistToWall--;
			}
		}
		for (backDistToWall = 1; foundBackDist != true; backDistToWall++) { // while distance to back wall not found
			var back = row + backDistToWall;
			if (returnTileTypeAtColRow(col, back) != 0) { //found collision
				foundBackDist = true;
				backDistToWall--;
			}
		}
		for (leftDistToWall = 1; foundLeftDist != true; leftDistToWall++) { // while distance to back wall not found
			var left = col - leftDistToWall;
			if (returnTileTypeAtColRow(left, row) != 0) { //found collision
				foundLeftDist = true;
				leftDistToWall--;
			}
		}
		for (rightDistToWall = 1; foundRightDist != true; rightDistToWall++) { // while distance to back wall not found
			var right = col + rightDistToWall;
			if (returnTileTypeAtColRow(right, row) != 0) { //found collision
				foundRightDist = true;
				rightDistToWall--;
			}
		}
		var adjustedAngle = sigmoid.func((this.ang > 0) ? (this.ang % (2 * Math.PI)) : (this.ang % (-2 * Math.PI) + 2 * Math.PI));
		frontDistToWall /= 20;
		backDistToWall /= 20;
		leftDistToWall /= 20;
		rightDistToWall /= 20;
		// console.log(frontDistToWall, backDistToWall, leftDistToWall, rightDistToWall);

		var prediction = this.brain.predict([adjustedAngle, frontDistToWall, backDistToWall, leftDistToWall, rightDistToWall])
		this.keyHeldGas = prediction[0] > 0.5 ? true : false;
		this.keyHeldBrakes = prediction[1] > 0.5 ? true : false;
		this.keyHeldTurnLeft = prediction[2] > 0.5 ? true : false;
		this.keyHeldTurnRight = prediction[3] > 0.5 ? true : false;

		if (this.keyHeldGas) { // executed every frame the up arrow is held
			this.speed += carGasRate;
		}
		if (this.keyHeldBrakes) {
			this.speed -= carBrakeRate;
		}
		// if (Math.abs(this.speed) > minSpeedToTurn) {
		if (this.keyHeldTurnLeft) {
			this.ang -= carTurnRate;
		}
		if (this.keyHeldTurnRight) {
			this.ang += carTurnRate;
		}
		// }
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