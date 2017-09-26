 /*			VERSION 20170924
TODO:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');

var blueCarPic = document.createElement('img');
var blueCarPicLoaded = false;

var showStartScreen = true;			//sets to true on reload
var showPauseScreen;
var showEndScreen;

var time;
var carMoved;
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
	carReset();
}

window.onload = function(){
	var framesPerSecond = 30;

	//setup variables
	setup();

	//run logic at ~fps
	setInterval(function(){moveEverything();drawEverything();}, 1000/framesPerSecond);

	//keyboard event detection
	canvas.addEventListener('mousemove', calculateMousePos);
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);

	blueCarPic.onload = function(){
		blueCarPicLoaded = true;
	};

	blueCarPic.src = 'blueCarPic.png';

}

function moveEverything(){
	if(!showStartScreen && !showPauseScreen && !showEndScreen){
		carMove();
		carTrackHandling();
	}

}

function drawEverything(){
	//black canvas background
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	//game
	if(!showStartScreen && !showPauseScreen){
		//tracks
		drawTracks();

		//time
		drawText('Time: '+Math.floor(time), 400, 200, 'center', 'white');

		//car
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

	//end screen
	if(showEndScreen){
		var resultatMeinung = [];
		var t = Math.floor(time);
		if(t<=20){
			resultatMeinung.push('ausserordentlich gut');
			resultatMeinung.push('bombenmässig');
			resultatMeinung.push('mega nice');
			resultatMeinung.push('profimässig');
		} else if(t>20 && t<24){
			resultatMeinung.push('sehr tropfig (\u00A9Lenny)');
			resultatMeinung.push('gut');
			resultatMeinung.push('nice');
		} else if(t>23 && t<27){
			resultatMeinung.push('ok');
			resultatMeinung.push('akzeptabel');
		} else{					//Math.floor(time)>25
			resultatMeinung.push('SCHEISSE');
			resultatMeinung.push('*facepalm* smh (\u00A9Maxi)');
		}
		var randChoice = resultatMeinung[Math.floor(Math.random() * resultatMeinung.length)];

		alert('Dein Resultat von '+Math.floor(time)+' sekunden ist '+randChoice);
		
		setup();


	}
}
