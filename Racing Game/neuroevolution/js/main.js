// TODO:
// Pool selection algorithm for genetic algorithm still has upward potential
// speed up reinforcement learning process
// multiplayer

let canvas = document.getElementById('gameCanvas');
let canvasContext = canvas.getContext('2d');

let showStartScreen = true; // sets to true on reload
let showPauseScreen;
let showEndScreen;

let debugGraphics = false;
let debugLog = true;
const logPath = 'log.txt';

// let blueCar = new carClass();
// let greenCar = new carClass();
let cars = [];
let generation = 0;

let carCount = 500;
let nextGenerationCars = [];
let foundNextGenCars = false;
const numOfBestCars = 10;
let bestEverFitness = 0;
let bestCurrentFitness = 0;

function setup() {
	// showStartScreen = true; does not activate start screen on every other reset than start, see variable assignment above
	showPauseScreen = false;
	showEndScreen = false;

	finishLineReached = false;
	waymarkReached = false;

	for (let i = 0; i < carCount; i++) {
		cars[i] = new carClass();
		const pic = blueCarPicIdle;
		cars[i].reset(firstPlayerStartTile, pic, pic, 'car');
	}

	loadLevel(levelOne);
}

function loadLevel(level) {
	trackGrid = level.slice(); // need to copy the array by value instead of referncing different memory of the same object

	// set cars position to start
	// blueCar.reset(firstPlayerStartTile, blueCarPicBrake, blueCarPicIdle, 'blaues Auto');
	// greenCar.reset(secondPlayerStartTile, greenCarPicBrake, greenCarPicIdle, 'grünes Auto');

	// for (let i = 0; i < cars.length; i++) {
	// 	let pic = blueCarPicIdle;
	// 	cars[i].reset(firstPlayerStartTile, pic, pic, 'car');
	// }
}

window.onload = function() {
	console.log('%cNeuroevolution'+ '%c|' + '%cRacing Game', 'background: #2f2f2f; font-weight: lighter; color: #029d0d; font-size: xx-large;','background: #2f2f2f; font-weight: bolder; color: #9d0292; font-size: xx-large;','background: #2f2f2f; font-weight: lighter; color: #029d0d; font-size: xx-large;');
	console.log('%cgithub.com/tobiasvonarx\n\n\n','color: #2f2f2f; font-size: medium;');

	if (debugGraphics) {
		carCount = 1;
	}
	
	// setup input event listeners
	setupInput();

	loadingScreen();

	// load images
	loadImages();
};

function initialiseGame() { // gets called when images finish loading
	let framesPerSecond = 30;

	// setup variables
	setup();

	// run logic at ~fps
	setInterval(function() {
		drawEverything();
		moveEverything();
	}, 1000 / framesPerSecond);
}

function loadingScreen() {
	// loading screen
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

		// const pic = greenCarPicIdle;

		// console.log(cars.length)

		for (let i = 0; i < cars.length; i++) {
			// cars[i].move()
			cars[i].score--;

			if (cars[i].score > bestCurrentFitness) {
				bestCurrentFitness = cars[i].score;
				// cars[i].imageIdle = greenCarPicIdle;
				// cars[i].imageBrake = greenCarPicIdle;

				if (cars[i].score > bestEverFitness) {
					bestEverFitness = cars[i].score;
				}
			}

			(cars[i].score < 0) ? cars.splice(i, 1): cars[i].move();
		}

		// how many cars to go to next gen
		if (cars.length <= numOfBestCars && !foundNextGenCars) {
			// console.log(cars.length, 'reached');
			nextGenerationCars = cars.slice();
			foundNextGenCars = true;
		}
	}
}

function drawEverything() {
	// game
	if (!showStartScreen && !showPauseScreen) {
		// tracks
		drawTracks();

		// car
		// blueCar.draw();
		// greenCar.draw();
		for (let i = 0; i < cars.length; i++) {
			cars[i].draw();
		}

		// time
		// drawText('Time: '+Math.floor(time), 400, 200, 'center', 'white');

	} else {
		// black canvas background
		colorRect(0, 0, canvas.width, canvas.height, 'black');

	}

	// start screen
	if (showStartScreen) {
		drawText('RACING GAME', canvas.width / 2, canvas.height / 2, 'center', 'white', '80px comic sans ms');
		drawText('Press SPACE to play', canvas.width / 2, canvas.height / 4 * 3, 'center', 'white', '40px verdana');
	}
	// pause screen
	if (showPauseScreen) {
		drawText('Game Paused', canvas.width / 2, canvas.height / 2, 'center', 'white', '80px arial black');
		drawText('Press SPACE to continue playing', canvas.width / 2, canvas.height / 4 * 3, 'center', 'white', '20px arial')
	}

	// end screen
	if (showEndScreen) {
		let winnerCar;
		let winnerCarName;
		// console.log(blueCar.time, greenCar.time);

		for (let i = 0; i < cars.length; i++) {
			let car = cars[i];
			if (car.finishLineReached) {
				winnerCar = car;
			}
		}

		console.log('Das ' + winnerCar.name + ' hat mit einem Resultat von ' + winnerCar.time.toFixed(2) + ' gewonnen!');

		nextGeneration();
	}
}
