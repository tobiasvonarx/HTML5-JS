var carX;
var carY;
var carAng;
var carSpeed;
const carRadius = 5;


//booleans for more natural steering
var keyHeldGas;
var keyHeldBrakes;
var keyHeldTurnLeft;
var keyHeldTurnRight;

const carGasRate = 0.05;
const carBrakeRate = 0.10;
const carTurnRate = 0.05;
const speedDecay = 0.988;		//percent
const minSpeedToTurn = 0.5;

var previousSpeed;

function carReset(){
	carAng = Math.radians(270);
	carSpeed = 0;
	previousSpeed = carSpeed;

	for(var eachRow=0;eachRow<trackRows;eachRow++) {			//two for loops to iterate through drawing the cols and rows
		for(var eachCol=0;eachCol<trackCols;eachCol++) {		//eachRow and eachCol are the loop variables

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);	//make a variable to map all tracks to an index


			if(trackGrid[arrayIndex]==firstPlayerStartTile){							//spawn-point blue car
				carX = (eachCol * trackSize) + (trackSize/2);
				carY = (eachRow * trackSize) + (trackSize/2);
			}
		}
	}
}


function carMove(){
	if(carMoved && !finishLineReached){
		time += 0.0333333;
	}

	if(keyHeldGas){			//executed every frame the up arrow is held
		carSpeed += carGasRate;
	}
	if(keyHeldBrakes){
		carSpeed -= carBrakeRate;
	}
	if(Math.abs(carSpeed)>minSpeedToTurn){
		if(keyHeldTurnLeft){
		carAng -= carTurnRate;
		}
		if(keyHeldTurnRight){
			carAng += carTurnRate;
		}
	}
	if(!keyHeldGas){
		carSpeed *= speedDecay;
	}

	carX += Math.cos(carAng) * carSpeed;						//move car
	carY += Math.sin(carAng) * carSpeed;
}

function drawCar(){
	//var previousSpeed = carSpeed;
	if (previousSpeed*speedDecay>carSpeed){									//if car is braking
		drawPicWithRotation(blueCarPicBrake, carX, carY, carAng);
	} else {
		drawPicWithRotation(blueCarPicIdle, carX, carY, carAng);
	}
	previousSpeed = carSpeed;
}