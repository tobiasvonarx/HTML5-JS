const carGasRate = 0.05;
const carBrakeRate = 0.10;
const carTurnRate = 0.05;
const speedDecay = 0.988; // percent
const minSpeedToTurn = 0.3;
const initialScore = 400;

function mutate(x) {
	if (Math.random(1) < 0.1) {
		// let offset = randomGaussian() * 0.5;
		let offset = (Math.random() * 2 - 1) / 2;
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
		this.brain = new NeuralNetwork(16, 8, 4);
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
	this.name;

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
		this.score = initialScore;

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

		for (let eachRow = 0; eachRow < trackRows; eachRow++) { //two for loops to iterate through drawing the cols and rows
			for (let eachCol = 0; eachCol < trackCols; eachCol++) { //eachRow and eachCol are the loop variables

				let arrayIndex = colRowToArrayIndex(eachCol, eachRow); //make a variable to map all tracks to an index

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
			let tileScore = tileScoreGrid[index];
			this.score += tileScore;
		} else {
			this.score--;
		}
	}

	this.move = function() {
		if (!finishLineReached) {
			this.time += 0.0333333;
			this.score--;
		}

		// let frontDistToWall;
		// let foundFrontDist = false;
		// let leftDistToWall;
		// let foundLeftDist = false;
		// let rightDistToWall;
		// let foundRightDist = false;
		// let backDistToWall;
		// let foundBackDist = false;

		// x = eachCol*trackSize + trackSize/2
		// eachCol*trackSize = x - trackSize/2
		// eachCol = x/trackSize - 1/2

		let col = Math.round(this.x / trackSize - 0.5);
		let row = Math.round(this.y / trackSize - 0.5);

		// console.log(col, row);
		//console.log(row);
		// let tile = returnTileTypeAtColRow(col, row);
		//console.log(tile);

		let top = (collision(this.waymarkReached, returnTileTypeAtColRow(col, row - 1)) == false) ? (0) : (1);
		let bottom = (collision(this.waymarkReached, returnTileTypeAtColRow(col, row + 1)) == false) ? (0) : (1);
		let left = (collision(this.waymarkReached, returnTileTypeAtColRow(col - 1, row)) == false) ? (0) : (1);
		let right = (collision(this.waymarkReached, returnTileTypeAtColRow(col + 1, row)) == false) ? (0) : (1);

		let topLeft = (collision(this.waymarkReached, returnTileTypeAtColRow(col - 1, row - 1)) == false) ? (0) : (1);
		let topRight = (collision(this.waymarkReached, returnTileTypeAtColRow(col + 1, row - 1)) == false) ? (0) : (1);
		let bottomLeft = (collision(this.waymarkReached, returnTileTypeAtColRow(col - 1, row + 1)) == false) ? (0) : (1);
		let bottomRight = (collision(this.waymarkReached, returnTileTypeAtColRow(col + 1, row + 1)) == false) ? (0) : (1);



		// document.getElementById("t").innerHTML = "top collision:           "+top;
		// document.getElementById("b").innerHTML = "bottom collision:        "+bottom;
		// document.getElementById("l").innerHTML = "left collision:          "+left;
		// document.getElementById("r").innerHTML = "right collision:         "+right;
		// document.getElementById("tl").innerHTML = "top-left collision:     "+topLeft;
		// document.getElementById("tr").innerHTML = "top-right collision:    "+topRight;
		// document.getElementById("bl").innerHTML = "bottom-left collision:  "+bottomLeft;
		// document.getElementById("br").innerHTML = "bottom-right collision: "+bottomRight;

		// console.log(top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight);

		// for (frontDistToWall = 1; foundFrontDist != true; frontDistToWall++) { // while distance to front wall not found
		// 	let front = row - frontDistToWall;
		// 	if (returnTileTypeAtColRow(col, front) != 0) { // found collision
		// 		foundFrontDist = true;
		// 		frontDistToWall--;
		// 	}
		// }
		// for (backDistToWall = 1; foundBackDist != true; backDistToWall++) { // while distance to back wall not found
		// 	let back = row + backDistToWall;
		// 	if (returnTileTypeAtColRow(col, back) != 0) { // found collision
		// 		foundBackDist = true;
		// 		backDistToWall--;
		// 	}
		// }
		// for (leftDistToWall = 1; foundLeftDist != true; leftDistToWall++) { // while distance to back wall not found
		// 	let left = col - leftDistToWall;
		// 	if (returnTileTypeAtColRow(left, row) != 0) { // found collision
		// 		foundLeftDist = true;
		// 		leftDistToWall--;
		// 	}
		// }
		// for (rightDistToWall = 1; foundRightDist != true; rightDistToWall++) { // while distance to back wall not found
		// 	let right = col + rightDistToWall;
		// 	if (returnTileTypeAtColRow(right, row) != 0) { // found collision
		// 		foundRightDist = true;
		// 		rightDistToWall--;
		// 	}
		// }
		this.ang = (this.ang > 0) ? (this.ang % (2 * Math.PI)) : (this.ang % (-2 * Math.PI) + 2 * Math.PI);
		let angleDeg = Math.degrees(this.ang);
		// frontDistToWall /= 20;
		// backDistToWall /= 20;
		// leftDistToWall /= 20;
		// rightDistToWall /= 20;
		// console.log(frontDistToWall, backDistToWall, leftDistToWall, rightDistToWall);

		// let prediction;


		let facingTop = (angleDeg > 247.5 && angleDeg < 292.5) ? 1 : 0;
		let facingTopRight = (angleDeg > 292.5 && angleDeg < 337.5) ? 1 : 0;
		let facingRight = (angleDeg > 337.5 || angleDeg < 22.5) ? 1 : 0;
		let facingBottomRight = (angleDeg > 22.5 && angleDeg < 67.5) ? 1 : 0;
		let facingBottom = (angleDeg > 67.5 && angleDeg < 112.5) ? 1 : 0;
		let facingBottomLeft = (angleDeg > 112.5 && angleDeg < 157.5) ? 1 : 0;
		let facingLeft = (angleDeg > 157.5 && angleDeg < 202.5) ? 1 : 0;
		let facingTopLeft = (angleDeg > 202.5 && angleDeg < 247.5) ? 1 : 0;
		
		// for debugging
		if (debugGraphics) {
			// console.log(angleDeg);

			let hS = 20;
			let s = 40;
			if (facingTop == 1) {
				colorRect(canvas.width / 2 - hS, 0, s, s, '#FF00FF');
			} else {
				colorRect(canvas.width / 2 - hS, 0, s, s, '#00FF00');
			}
			if (facingBottom == 1) {
				colorRect(canvas.width / 2 - hS, canvas.height - s, s, s, '#FF00FF');
			} else {
				colorRect(canvas.width / 2 - hS, canvas.height - s, s, s, '#00FF00');
			}
			if (facingLeft == 1) {
				colorRect(0, canvas.height / 2 - hS, s, s, '#FF00FF');
			} else {
				colorRect(0, canvas.height / 2 - hS, s, s, '#00FF00');
			}
			if (facingRight == 1) {
				colorRect(canvas.width - s, canvas.height / 2 - hS, s, s, '#FF00FF');
			} else {
				colorRect(canvas.width - s, canvas.height / 2 - hS, s, s, '#00FF00');
			}
			if (facingTopLeft == 1) {
				colorRect(0, 0, s, s, '#FF00FF');
			} else {
				colorRect(0, 0, s, s, '#00FF00');
			}
			if (facingTopRight == 1) {
				colorRect(canvas.width - s, 0, s, s, '#FF00FF');
			} else {
				colorRect(canvas.width - s, 0, s, s, '#00FF00');
			}
			if (facingBottomLeft == 1) {
				colorRect(0, canvas.height - s, s, s, '#FF00FF');
			} else {
				colorRect(0, canvas.height - s, s, s, '#00FF00');
			}
			if (facingBottomRight == 1) {
				colorRect(canvas.width - s, canvas.height - s, s, s, '#FF00FF');
			} else {
				colorRect(canvas.width - s, canvas.height - s, s, s, '#00FF00');
			}

			document.getElementById("t").innerHTML = "top:           "+top+" "+facingTop;
			document.getElementById("b").innerHTML = "bottom:        "+bottom+" "+facingBottom;
			document.getElementById("l").innerHTML = "left:          "+left+" "+facingLeft;
			document.getElementById("r").innerHTML = "right:         "+right+" "+facingRight;
			document.getElementById("tl").innerHTML = "top-left:     "+topLeft+" "+facingTopLeft;
			document.getElementById("tr").innerHTML = "top-right:    "+topRight+" "+facingTopRight;
			document.getElementById("bl").innerHTML = "bottom-left:  "+bottomLeft+" "+facingBottomLeft;
			document.getElementById("br").innerHTML = "bottom-right: "+bottomRight+" "+facingBottomRight;
		}

		let prediction = this.brain.predict([top, bottom, left, right, topLeft, topRight, bottomLeft, bottomRight,
											 facingTop, facingBottom, facingLeft, facingRight,
											 facingTopLeft, facingTopRight, facingBottomLeft, facingBottomRight]);
		this.keyHeldGas = prediction[0] > 0.5;
		this.keyHeldBrakes = prediction[1] > 0.5;
		this.keyHeldTurnLeft = prediction[2] > 0.5;
		this.keyHeldTurnRight = prediction[3] > 0.5;

		let i = prediction.indexOf(Math.max(prediction));

		switch (i) {
			case 0:
				this.keyHeldGas = true;
				break;
			case 1:
				this.keyHeldBrakes = true;
				break;
			case 2:
				this.keyHeldTurnLeft = true;
				break;
			case 3:
				this.keyTurnRight = true;
		}


		if (this.keyHeldGas) { // executed every frame the up arrow is held
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