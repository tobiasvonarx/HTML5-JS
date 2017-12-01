 /*			VERSION 20170924
TODO:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
-2nd car implementation
-2 skins per car, w/ brake lights and without
(-Highscore system and highest speed ever system in pix/frame derived from carSpeed)
-IMPORTANT: FIX INPUT KEYS FOR CAR CONTROL!!!
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');

var showStartScreen = true;			//sets to true on reload
var showPauseScreen;
var showEndScreen;

var blueCar = new carClass();
var greenCar = new carClass();

var time;
var carMoved;						//update
var finishLineReached;
var waymarkReached;


function setup(){
	//showStartScreen = true;		does not activate start screen on every other reset than start, see variable assignment above
	showPauseScreen = false;
	showEndScreen = false;

	keyHeldGas = false;
	keyHeldBrakes = false;
	keyHeldTurnLeft = false;
	keyHeldTurnRight = false;

	time = 0;
	carMoved = false;
	finishLineReached = false;
	waymarkReached = false;

	//set cars position to start
	blueCar.reset(firstPlayerStartTile,blueCarPicBrake,blueCarPicIdle);
	greenCar.reset(secondPlayerStartTile,greenCarPicBrake,greenCarPicIdle);
}

window.onload = function(){
	console.log('Hello World');
	//setup input event listeners
	setupInput();

	loadingScreen();

	//load images
	loadImages();	
}

function initialiseGame(){			//gets called when images finish loading
	var framesPerSecond = 30;

	//setup variables
	setup();

	//run logic at ~fps
	setInterval(function(){moveEverything();drawEverything();}, 1000/framesPerSecond);
}

function loadingScreen(){
	//loading screen
	colorRect(0, 0, canvas.width, canvas.height, 'black');
	drawText('Music by Schlengnon', 15, 15, 'begin', 'white', '5px verdana');
	drawText('Loading...', canvas.width/2, canvas.height/2, 'center', 'white', '30px verdana');
}

function moveEverything(){
	if(!showStartScreen && !showPauseScreen && !showEndScreen){
		blueCar.move();
		greenCar.move();
	}

}

function drawEverything(){
	//game
	if(!showStartScreen && !showPauseScreen){
		//tracks
		drawTracks();

		//car
		blueCar.draw();
		greenCar.draw();

		//time
		//drawText('Time: '+Math.floor(time), 400, 200, 'center', 'white');

	} else {
		//black canvas background
		colorRect(0, 0, canvas.width, canvas.height, 'black');

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

	//end screen
	if(showEndScreen){
		var resultatMeinung = [];
		var t = Math.floor(time);
		if(t<=20){
			resultatMeinung.push('profimässig');
		} else if(t>20 && t<24){
			resultatMeinung.push('sehr tropfig (\u00A9Lenny)');
			resultatMeinung.push('nice');
		} else if(t>23 && t<25){
			resultatMeinung.push('akzeptabel');
		} else{					//Math.floor(time)>25
			resultatMeinung.push('*facepalm* smh (\u00A9Maxi)');
		}
		var randChoice = resultatMeinung[Math.floor(Math.random() * resultatMeinung.length)];

		alert('Dein Resultat von '+time.toFixed(2)+' sekunden ist '+randChoice);
		
		setup();


	}
}
