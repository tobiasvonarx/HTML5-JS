var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');
var xVelocity = 0;
var yVelocity = 0;
const gridSize = 20;
const tileCount = 20;
const tileGap = 2;
var snakeX = tileCount / 2;
var snakeY = tileCount / 2;
var appleX = Math.floor(Math.random() * tileCount);
var appleY = Math.floor(Math.random() * tileCount);
var trail = [];
const startingTailLength = 5;
var tailLength = startingTailLength;
var score = tailLength - 5;
var highscore = score;

window.onload = function() {
	const fps = 10;
	setInterval(game, 1000 / fps);
	document.addEventListener('keydown', handleKeyPress);
	document.addEventListener('mousedown', handleMousePress); //cheat
};

function handleMousePress(event) {
	tailLength++;
}


function handleKeyPress(event) {
	//don't allow going backwards
	switch (event.keyCode) {
		case 37: //left arrow
			if (xVelocity != 1) { //don't allow going backwards
				xVelocity = -1;
				yVelocity = 0;
			}
			break;
		case 38: //up arrow
			if (yVelocity != 1) {
				yVelocity = -1;
				xVelocity = 0;
			}
			break;
		case 39: //right arrow
			if (xVelocity != -1) {
				xVelocity = 1;
				yVelocity = 0;
			}
			break;
		case 40: //down arrow
			if (yVelocity != -1) {
				yVelocity = 1;
				xVelocity = 0;
			}
			break;
	}
}

function game() {
	//scoring
	score = tailLength - 5;
	document.getElementById('HTMLscore').innerHTML = 'Score: ' + score;
	document.getElementById('HTMLhighScore').innerHTML = 'Highscore: ' + highscore;

	//move snake
	snakeX += xVelocity;
	snakeY += yVelocity;

	//x goes off screen
	if (snakeX < 0) {
		snakeX = tileCount - 1;
	}

	if (snakeX > tileCount - 1) {
		snakeX = 0;
	}

	//y goes off screen
	if (snakeY < 0) {
		snakeY = tileCount - 1;
	}

	if (snakeY > tileCount - 1) {
		snakeY = 0;
	}

	//background black
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	//apple
	colorRect(appleX * gridSize, appleY * gridSize, gridSize - tileGap, gridSize - tileGap, 'red');

	//snake
	for (var part = 0; part < trail.length; part++) {
		//y and y for each individual snake part
		var x = trail[part].x;
		var y = trail[part].y;

		if (part == trail.length - 1) {
			colorRect(x * gridSize, y * gridSize, gridSize - tileGap, gridSize - tileGap, 'blue');
		} else {
			colorRect(x * gridSize, y * gridSize, gridSize - tileGap, gridSize - tileGap, 'lime');
		}

		//colorRect(x,y,gridSize-tileGap,gridSize-tileGap,'lime');

		//collision head with tail
		if (x == snakeX && y == snakeY) {
			//set highscore
			if (score > highscore) {
				highscore = score
			}
			tailLength = startingTailLength;
		}
	}

	//add head to trail
	trail.push({
		x: snakeX,
		y: snakeY
	});

	//old trail parts get removed, -> perception of moving snake
	while (trail.length > tailLength) {
		trail.shift(); //first element of array get removed
	}


	//got the apple
	if (appleX == snakeX && appleY == snakeY) {
		tailLength++;
		appleX = Math.floor(Math.random() * tileCount);
		appleY = Math.floor(Math.random() * tileCount);
	}

}