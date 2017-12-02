const carGasRate = 0.05;
const carBrakeRate = 0.10;
const carTurnRate = 0.05;
const speedDecay = 0.988;		//percent
const minSpeedToTurn = 0.3;

function carClass(){
	this.x;
	this.y;
	this.ang;
	this.speed;

	this.imageBrake;
	this.imageIdle;

	//booleans for steering
	this.keyHeldGas;
	this.keyHeldBrakes;
	this.keyHeldTurnLeft;
	this.keyHeldTurnRight;

	this.controlKeyGas;
	this.controlKeyBrakes;
	this.controlKeyTurnLeft;
	this.controlKeyTurnRight;

	this.moved;
	this.time;
	this.name

	this.finishLineReached;
	this.waymarkReached;

	this.setupKeys = function(keyGas,keyBrakes,keyTurnLeft,keyTurnRight){
		this.controlKeyGas = keyGas;
		this.controlKeyBrakes = keyBrakes;
		this.controlKeyTurnLeft = keyTurnLeft;
		this.controlKeyTurnRight = keyTurnRight;
	}

	this.reset = function(startTile, carImageBrake, carImageIdle, name){
		this.name = name

		//booleans for steering
		this.keyHeldGas = false;
		this.keyHeldBrakes = false;
		this.keyHeldTurnLeft = false;
		this.keyHeldTurnRight = false;

		this.waymarkReached = false;
		this.finishLineReached = false;

		this.imageBrake = carImageBrake;
		this.imageIdle = carImageIdle;
		this.ang = Math.radians(270);
		this.speed = 0;
		this.moved = false;
		this.time = 0;

		for(var eachRow=0;eachRow<trackRows;eachRow++) {				//two for loops to iterate through drawing the cols and rows
			for(var eachCol=0;eachCol<trackCols;eachCol++) {			//eachRow and eachCol are the loop variables

				var arrayIndex = rowColToArrayIndex(eachCol, eachRow);	//make a variable to map all tracks to an index

				if(trackGrid[arrayIndex]==startTile){					//spawn-point
					this.x = (eachCol * trackSize) + (trackSize/2);
					this.y = (eachRow * trackSize) + (trackSize/2);
				}
			}
		}
	}

	this.move = function(otherCar){
		if(this.moved && otherCar.moved){
			if(!finishLineReached){
				this.time += 0.0333333;
			}

			if(this.keyHeldGas){												//executed every frame the up arrow is held
				this.speed += carGasRate;
			}
			if(this.keyHeldBrakes){
				this.speed -= carBrakeRate;
			}
			if(Math.abs(this.speed)>minSpeedToTurn){
				if(this.keyHeldTurnLeft){
					this.ang -= carTurnRate;
				}
				if(this.keyHeldTurnRight){
					this.ang += carTurnRate;
				}
			}
			if(!this.keyHeldGas){
				this.speed *= speedDecay;
			}

			this.x += Math.cos(this.ang) * this.speed;						//move car
			this.y += Math.sin(this.ang) * this.speed;

			carTrackHandling(this);
		}

	}

	this.draw = function(){
		if (this.keyHeldBrakes){											//if car is braking
			drawPicWithRotation(this.imageBrake, this.x, this.y, this.ang);	
		} else {
			drawPicWithRotation(this.imageIdle, this.x, this.y, this.ang);
		}
	}

}