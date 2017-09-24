 /*			VERSION 20170924
TODO:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
	GIMP - 2nd car design with .psd 1st car as template/reference
	Natural decellaration, maybe subtract approximately 0.1 from carSpeed every frame or so
	Better interface for time, maybe white font on green grass background, remove console.log for logging time
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');

var blueCarPic = document.createElement('img');
var blueCarPicLoaded = false;

var carX;
var carY;
var carAng;
var carSpeed;
var paddleX;
const carRadius = 5;
const paddleDistanceFromSide = 60;
const paddleThickness = 12;
const paddleLength = 85;
const paddleY = canvas.height - paddleDistanceFromSide - paddleThickness;
const deflectionRate = 9;
const trackSize = 40;
const trackCols = 20;
const trackRows = 15;
const trackGap = 0;
const finishLineColors = ['white', 'black'];
var trackGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
                 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
                 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 2, 3, 1, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                 1, 5, 5, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1,
                 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

var showStartScreen;
var showPauseScreen;
var showEndScreen;
var tracksLeft;
var timeLeft;

var time;
var carMoved;
var finishLineReached;
var waymarkReached;

//booleans for more natural steering
var keyHeldGas;
var keyHeldBrakes;
var keyHeldTurnLeft;
var keyHeldTurnRight;

function carReset(){
	carAng = Math.radians(270);

	carSpeed = 0;

	for(var eachRow=0;eachRow<trackRows;eachRow++) {			//two for loops to iterate through drawing the cols and rows
		for(var eachCol=0;eachCol<trackCols;eachCol++) {		//eachRow and eachCol are the loop variables

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);	//make a variable to map all tracks to an index


			if(trackGrid[arrayIndex]==2){							//spawnpoint blue car
				carX = (eachCol * trackSize) + (trackSize/2);
				carY = (eachRow * trackSize) + (trackSize/2);
			}
		}
	}
}

function setup(){
	showStartScreen = true;
	showPauseScreen = false;
	showEndScreen = false;

	keyHeldGas = false;
	keyHeldBrakes = false;
	keyHeldTurnLeft = false;
	keyHeldTurnRight = false;

	//add math methods radians and degree for conversion
	Math.radians = function(degrees){
		return degrees * Math.PI / 180;
	};

	Math.degrees = function(radians){
		return radians * 180 / Math.PI;
	};

	time = 0;
	carMoved = false;
	finishLineReached = false;
	waymarkReached = false;

	//set cars position to start
	carReset();
}

function calculateMousePos(event){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = event.clientX - rect.left - root.scrollLeft;
	mouseY = event.clientY - rect.top - root.scrollTop;
}

function handleKeyDown(event){
	if(showPauseScreen||showStartScreen||showEndScreen){
		switch(event.keyCode){
			case 32:			//SPACE or ENTER
				if(showStartScreen){
					setup();
					showStartScreen = false;
				}else if(showPauseScreen){
					showPauseScreen = false;
				}else if(showEndScreen){
					setup();
				}
				break;
			case 13:
				if(showStartScreen){
						setup();
						showStartScreen = false;
					}else if(showPauseScreen){
						showPauseScreen = false;
					}else if(showEndScreen){
						setup();
					}
				break;
		}
	}
	if(!showStartScreen && !showEndScreen){		//game is running
		switch(event.keyCode){
			case 27:												//esc
				showPauseScreen = true;
				break;
			case 37: 												//left arrow  	
				keyHeldTurnLeft = true;
				carMoved = true;
				break;	
			case 38: 												//up arrow
				keyHeldGas = true;
				carMoved = true;
				break;
			case 39: 												//right arrow
				keyHeldTurnRight = true;
				carMoved = true;
				break;
			case 40: 												//down arrow
				keyHeldBrakes = true;
				carMoved = true;
				break;
			case 87: 												//w	
				keyHeldGas = true;
				carMoved = true;
				break;	
			case 65: 												//a
				keyHeldTurnLeft = true;
				carMoved= true;
				break;
			case 83: 												//s
				keyHeldBrakes = true;
				carMoved = true;
				break;
			case 68: 												//d
				keyHeldTurnRight = true;
				carMoved = true;
				break;
		}
	}
}

function handleKeyUp(event){
	if(showStartScreen == false && showEndScreen == false){		//game is running
		switch(event.keyCode){
			case 37:
				keyHeldTurnLeft = false;					//left arrow
				break;
			case 38:
				keyHeldGas = false;							//up arrow
				break;
			case 39:
				keyHeldTurnRight = false;					//right arrow
				break;
			case 40:
				keyHeldBrakes = false;						//down arrow
				break;

			case 87:
				keyHeldGas = false;									//w
				break;
			case 65:
				keyHeldTurnLeft = false;							//a
				break;
			case 83:
				keyHeldBrakes = false;								//s
				break;
			case 68:
				keyHeldTurnRight = false;							//d
				break;
		}
	}
}

window.onload = function(){
	var framesPerSecond = 30;

	//setup variables
	setup();

	//run logic at ~fps
	setInterval(function(){moveEverything();drawEverything();}, 1000/framesPerSecond);

	//keyobard event detection
	canvas.addEventListener('mousemove', calculateMousePos);
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);

	blueCarPic.onload = function(){
		blueCarPicLoaded = true;
	};

	blueCarPic.src = 'blueCarPic.png';

}

function carMove(){
	if(carMoved && !finishLineReached){
		time += 0.0333333;
	}
	console.log('Time: ',Math.floor(time));


	if(keyHeldGas){			//executed every frame the up arrow is held
		carSpeed += 0.04;
	}
	if(keyHeldBrakes){
		carSpeed -= 0.07;
	}
	if(keyHeldTurnLeft){
		carAng -= 0.05;
	}
	if(keyHeldTurnRight){
		carAng += 0.05;
	}

		carX += Math.cos(carAng) * carSpeed;						//move car
		carY += Math.sin(carAng) * carSpeed;
}

function isTrackAtColRow(col, row) {
	if(col >= 0 && col < trackCols &&			//no bugs
		row >= 0 && row < trackRows) {
		var trackIndexUnderCoord = rowColToArrayIndex(col, row);

		if(waymarkReached && (trackGrid[trackIndexUnderCoord]==2||trackGrid[trackIndexUnderCoord]==3)){		//if waymark reached and finish line crossed
			finishLineReached = true;
		} else if(trackGrid[trackIndexUnderCoord]==4){ 														//if waymark reached
			waymarkReached = true;
		}

		if(!waymarkReached){
			return (trackGrid[trackIndexUnderCoord]==1||trackGrid[trackIndexUnderCoord]==5);
		} else {											//waymark reached
			return(trackGrid[trackIndexUnderCoord]==1);
		}
	} else {
		return false;
	}
}

function carTrackHandling(){
	var carTrackCol = Math.floor(carX / trackSize);
	var carTrackRow = Math.floor(carY / trackSize);
	var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

	if(carTrackCol >= 0 && carTrackCol < trackCols &&			//no bugs
		carTrackRow >= 0 && carTrackRow < trackRows) {

		if(isTrackAtColRow(carTrackCol, carTrackRow)) {			//wall
			carSpeed *= -1
			carSpeed /= 2
		}
	}
}

function moveEverything(){
	if(!showStartScreen && !showPauseScreen && !showEndScreen){
		carMove();
		carTrackHandling();
	}

}

function rowColToArrayIndex(col, row){
	return col + trackCols * row;		//function to return index of track at a column and a row
}

function drawTracks(){
	for(var eachRow=0;eachRow<trackRows;eachRow++) {			//two for loops to iterate through drawing the cols and rows
		for(var eachCol=0;eachCol<trackCols;eachCol++) {		//eachRow and eachCol are the loop variables

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);	//make a variable to map all tracks to an index
			
			if(trackGrid[arrayIndex]==0){					//wall
				colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'gray');
			}else if(trackGrid[arrayIndex]==1){				//grass
				colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'green');
			}else if(trackGrid[arrayIndex]==2 || trackGrid[arrayIndex]==3){				//flag
				for(var i=0;i<trackSize;i+=trackSize/5){			//row
					for(var j=0;j<trackSize;j+=trackSize/5){		//column
						colorRect(trackSize*eachCol+i, trackSize*eachRow+j, trackSize/5, trackSize/5, finishLineColors[1]);
						finishLineColors.reverse();					//change colors
					}
				}
			}else if(trackGrid[arrayIndex]==4){
				colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'gray');	//waymark (to prevent cheating)
			}else if(trackGrid[arrayIndex]==5){
				colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'gray');	//blocking the player to go behind the finish/starting line at beginning
			}
		}
	}
}

function drawEverything(){
	//black canvas background
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	//game
	if(!showStartScreen && !showPauseScreen && !showEndScreen){
		//tracks
		drawTracks();
		//car
		//colorCircle(carX, carY, carRadius, 'red');
		if(blueCarPicLoaded){
			drawPicWithRotation(blueCarPic, carX, carY, carAng);
		}
	}

	//start screen
	if(showStartScreen){
		drawText('RACING GAME', canvas.width/2, canvas.height/2, 'center', 'white', '80px comic sans ms');
		drawText('Press SPACE to play', canvas.width/2, canvas.height/4*3, 'center', 'white', '40px verdana');
	}
	//pause screen
	if(showPauseScreen){
		drawText('Game Paused', canvas.width/2, canvas.height/2, 'center', 'white', '80px arial black');
		drawText('Press SPACE to continue playing', canvas.width/2, canvas.height/4*3, 'center', 'white', '20px arial')
	}

}

function drawPicWithRotation(img, x, y, angle){
	canvasContext.save();																	//save
	canvasContext.translate(x, y);															//https://www.udemy.com/how-to-program-games/learn/v4/t/lecture/3440548?start=60
	canvasContext.rotate(angle);
	canvasContext.drawImage(img, -blueCarPic.width/2, -blueCarPic.height/2);
	canvasContext.restore();																//restore to last save
}

function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath(); 												//prepare for filling
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); 		//create arc
	canvasContext.fill();	 												//no .arcfill so this fill method
}

function drawText(text, X, Y, alignment, drawColor, font='10px sans-serif'){
	canvasContext.font = font;
	canvasContext.fillStyle = drawColor;
	canvasContext.textAlign = alignment;
	canvasContext.fillText(text, X, Y);
}
