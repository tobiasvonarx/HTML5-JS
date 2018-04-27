 // Last updated 20180422
 // TODO:
 // Pool selection algorithm for genetic algorithm is not good, rather use the top 10 cars or so to achieve greater variety and potential
 // speed up reinforcement learning process
 // COMMENT OUT ga.js code


 var canvas = document.getElementById('gameCanvas');
 var canvasContext = canvas.getContext('2d');

 var showStartScreen = true; //sets to true on reload
 var showPauseScreen;
 var showEndScreen;

 // var blueCar = new carClass();
 // var greenCar = new carClass();
 var cars = [];
 var allCars = [];
 var carCount = 500;

 function setup() {
 	//showStartScreen = true;		does not activate start screen on every other reset than start, see variable assignment above
 	showPauseScreen = false;
 	showEndScreen = false;

 	finishLineReached = false;
 	waymarkReached = false;

 	for (var i = 0; i < carCount; i++) {
 		cars[i] = new carClass();
 		var pic = blueCarPicIdle;
 		cars[i].reset(firstPlayerStartTile, pic, pic, 'car');
 	}
 	allCars = cars.slice();

 	loadLevel(levelOne);
 }

 function loadLevel(level) {
 	trackGrid = level.slice(); //need to copy the array by value instead of referncing different memory of the same object

 	//set cars position to start
 	// blueCar.reset(firstPlayerStartTile, blueCarPicBrake, blueCarPicIdle, 'blaues Auto');
 	// greenCar.reset(secondPlayerStartTile, greenCarPicBrake, greenCarPicIdle, 'grünes Auto');

 	// for (var i = 0; i < cars.length; i++) {
 	// 	var pic = blueCarPicIdle;
 	// 	cars[i].reset(firstPlayerStartTile, pic, pic, 'car');
 	// }
 }

 window.onload = function() {
 	console.log('Hello World');
 	//setup input event listeners
 	setupInput();

 	loadingScreen();

 	//load images
 	loadImages();
 }

 function initialiseGame() { //gets called when images finish loading
 	var framesPerSecond = 30;

 	//setup variables
 	setup();

 	//run logic at ~fps
 	setInterval(function() {
 		drawEverything();
 		moveEverything();
 	}, 1000 / framesPerSecond);
 }

 function loadingScreen() {
 	//loading screen
 	colorRect(0, 0, canvas.width, canvas.height, 'black');
 	drawText('Music by Schlengnon', 15, 15, 'begin', 'white', '5px verdana');
 	drawText('Loading...', canvas.width / 2, canvas.height / 2, 'center', 'white', '30px verdana');
 }

 function moveEverything() {
 	// console.log(cars.length);

 	if (!showStartScreen && !showPauseScreen && !showEndScreen) {
 		// blueCar.move();
 		// greenCar.move();

 		if (cars.length == 0) {
 			nextGeneration();
 		}

 		for (var i = 0; i < cars.length; i++) {
 			// cars[i].move()

 			(cars[i].score < 0) ? cars.splice(i, 1): cars[i].move();
 		}
 	}

 }

 function drawEverything() {
 	//game
 	if (!showStartScreen && !showPauseScreen) {
 		//tracks
 		drawTracks();

 		//car
 		// blueCar.draw();
 		// greenCar.draw();
 		for (var i = 0; i < cars.length; i++) {
 			cars[i].draw();
 		}

 		//time
 		//drawText('Time: '+Math.floor(time), 400, 200, 'center', 'white');

 	} else {
 		//black canvas background
 		colorRect(0, 0, canvas.width, canvas.height, 'black');

 	}

 	//start screen
 	if (showStartScreen) {
 		drawText('RACING GAME', canvas.width / 2, canvas.height / 2, 'center', 'white', '80px comic sans ms');
 		drawText('Press SPACE to play', canvas.width / 2, canvas.height / 4 * 3, 'center', 'white', '40px verdana');
 	}
 	//pause screen
 	if (showPauseScreen) {
 		drawText('Game Paused', canvas.width / 2, canvas.height / 2, 'center', 'white', '80px arial black');
 		drawText('Press SPACE to continue playing', canvas.width / 2, canvas.height / 4 * 3, 'center', 'white', '20px arial')
 	}

 	//end screen
 	if (showEndScreen) {
 		var winnerCar;
 		var winnerCarName;
 		//console.log(blueCar.time, greenCar.time);

 		for (var i = 0; i < cars.length; i++) {
 			var car = cars[i];
 			if (car.finishLineReached) {
 				winnerCar = car;
 			}
 		}


 		/*
 		var resultatMeinung = [];
 		if(winnerCar.time<=20){
 			resultatMeinung.push('profimässig');
 			resultatMeinung.push('')
 			resultatMeinung.push('mlg wow');
 		} else if(t>20 && t<24){
 			resultatMeinung.push('sehr tropfig (\u00A9Lenny)');
 			resultatMeinung.push('nice');
 		} else if(t>23 && t<25){
 			resultatMeinung.push('oké');
 		} else{					//Math.floor(time)>25
 			resultatMeinung.push('*facepalm* smh (\u00A9Maxi)');
 			resultatMeinung.push('')
 		}
 		var randChoice = resultatMeinung[Math.floor(Math.random() * resultatMeinung.length)];
 		//alert('Dein Resultat von '+time.toFixed(2)+' sekunden ist '+randChoice);
 		*/

 		console.log('Das ' + winnerCar.name + ' hat mit einem Resultat von ' + winnerCar.time.toFixed(2) + ' gewonnen!');

 		nextGeneration();

 	}
 }