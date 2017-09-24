 /*			VERSION 20170922
TODO:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');
var ballX;			//define these in ballReset() & paddleReset()
var ballY;
var ballSpeedX;
var ballSpeedY;
var paddleX;
const rainbowColors = ['#FF0000', '#E2571E', '#FF7F00', '#FFFF00', '#00FF00', '#96bf33', '#0000FF', '#4B0082', '#8B00FF', '#ffffff'];		//rainbow color spectrum in hex codes
const ballRadius = 5;
const paddleDistanceFromSide = 60;
const paddleThickness = 12;
const paddleLength = 85;
const paddleY = canvas.height - paddleDistanceFromSide - paddleThickness;
const deflectionRate = 9;
const brickWidth = 50;
const brickHeight = 25;
const brickCols = 16;
const brickRows = 10;
const brickGap = 2;
var brickGrid = new Array(brickCols * brickRows);
var score;
var multiplier;
var lives;
var showStartScreen;
var showPauseScreen;
var showEndScreen;
var bricksLeft;
var timeLeft;

var leftArrowHeld;
var rightArrowHeld;

function ballReset(){
	ballX = canvas.width/3;
	ballY = canvas.height*3/5;
	ballSpeedX = 3;
	ballSpeedY = 3;
	paddleX = canvas.width/2 - paddleLength/2

	if(lives < 1){		//no lives
		gameOver = true;
	}else{				//at least 1 life
		lives -= 1;
	}
}

function paddleReset(){
	paddleX = (canvas.width/2) - (paddleLength/2);
}

function setup(){
	showStartScreen = true;
	showPauseScreen = false;
	showEndScreen = false;

	leftArrowHeld = false;
	rightArrowHeld = false;

	ballReset();
	paddleReset();
	//score reset
	score = 0;
	multiplier = 0;
	//timer reset
	timeLeft = 7200;		//7200 frames -> 120 seconds at 60 fps
	//lives reset
	lives = 3;
	//brick setup
	bricksLeft = brickCols * brickRows;
	var i;
	bricksLeft = brickRows * brickCols;

	for(i=0;i<3*brickCols;i++){
		brickGrid[i] = false;
		bricksLeft--;
	}

	for(;i<brickCols*brickRows;i++){			//set all bricks to true (visible)
	/*
		if(Math.random()>0.5){
			brickGrid[i] = true;
		}else{
			brickGrid[i] = false;
		}
	*/
		brickGrid[i] = true;
	}
}
/*
function calculateMousePos(event){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	mouseX = event.clientX - rect.left - root.scrollLeft;
	mouseY = event.clientY - rect.top - root.scrollTop;

	paddleX = mouseX - paddleLength/2;

}
*/
function handleKeyPress(event){
	switch(event.keyCode){
		case 32: 							//space
			if(showStartScreen){
				setup();
				showStartScreen = false;
			}else if(showPauseScreen){
				showPauseScreen = false;
			}else if(showEndScreen){
				setup();
			}
			break;
		case 13: 							//return, enter
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
	if(!showStartScreen && !showEndScreen && !showPauseScreen){
		switch(event.keyCode){
			case 27: 								//Esc
				showPauseScreen = true;
				break;
			case 37: 								//left arrow
				leftArrowHeld = true;
				break;
			case 39: 								//right arrow
				rightArrowHeld = true;
				break;
		}
	}
}

function handleKeyUp(event){

	if(!showStartScreen && !showEndScreen && !showPauseScreen){
		switch(event.keyCode){
			case 37: 			//left arrow
				leftArrowHeld = false;
				break;
			case 39: 			//right arrow
				rightArrowHeld = false;
				break;
		}



		if(event.keyCode == 37){		//Left arrow
			leftArrowHeld = false;
		}
		if(event.keyCode == 39){
			rightArrowHeld = false;
		}
	}
}

window.onload = function(){
	setup();
	var framesPerSecond = 60;

	setInterval(function(){moveEverything();drawEverything();}, 1000/framesPerSecond);
	//canvas.addEventListener('mousemove', calculateMousePos);
	window.addEventListener('keydown', handleKeyPress);
	window.addEventListener('keyup', handleKeyUp);

	//add math methods radians and degree for conversion
	Math.radians = function(degrees){
		return degrees * Math.PI / 180;
	}
	Math.degrees = function(radians){
		return radians * 180 / Math.PI;
	}
}

function hitBrickScoring(){
	score -= multiplier ** 2;		//remove old multiplier score
	multiplier += 1;				//update multiplier
	score += multiplier ** 2;		//add bigger score
}

function hitPaddleScoring(){
	multiplier = 0;
}

function ballMove(){
	ballX += ballSpeedX;						//move ball
	ballY += ballSpeedY;

	if(ballX - ballRadius <= 0){				//reflect the ball on the left side
		ballSpeedX = -ballSpeedX;
	}
	if(ballX + ballRadius >= canvas.width){		//reflect the ball on the right side
		ballSpeedX = -ballSpeedX;
	}
	if(ballY - ballRadius <= 0){				//reflect the ball on the top side
		ballSpeedY = -ballSpeedY;
	}
	if(ballY - ballRadius >= canvas.height){	//reset the ball if it goes below the bottom side
		ballReset();
	}
}

function findColRowFromCoordinates(x, y){
	//function to find the previous row and col of an x and y pair
	var pbx = x - ballSpeedX;
	var pby = y - ballSpeedY;
	var col = Math.floor(pbx/brickWidth);
	var row = Math.floor(pby/brickHeight);

	return{
		col:col,
		row:row
	};
}

function ballBrickHandling(){
	for(var angle = 0; angle < 359; angle++){

		var x = ballX + ballRadius * Math.cos(Math.radians(angle))
		var y = ballY + ballRadius * Math.sin(Math.radians(angle))

		var ballBrickCol = Math.floor(x/brickWidth);
		var ballBrickRow = Math.floor(y/brickHeight);

		var brickIndexUnderBall = rowColToArrayIndex(ballBrickCol, ballBrickRow);

		if(ballBrickCol >= 0 && ballBrickCol < brickCols &&
			ballBrickRow >= 0 && ballBrickRow < brickRows &&
			brickGrid[brickIndexUnderBall] == true){				//brick is activated

			brickGrid[brickIndexUnderBall] = false;					//delete brick
			bricksLeft--;

			//brickGrid.every(function(bool){return bool == false;}) 		was used before
			if(bricksLeft == 0){			//Game finished		
				showEndScreen = true;
			}

			//Check where the ball was before, and reflecting the ball accordingly
			var previousBallPosition = findColRowFromCoordinates(x, y);
			//8 possibilities
			if(previousBallPosition.col < ballBrickCol && previousBallPosition.row < ballBrickRow ||	//DIAGONAL TOP LEFT
			previousBallPosition.col > ballBrickCol && previousBallPosition.row < ballBrickRow ||		//DIAGONAL TOP RIGHT
			previousBallPosition.col < ballBrickCol && previousBallPosition.row > ballBrickRow ||		//DIAGONAL BOTTOM LEFT
			previousBallPosition.col > ballBrickCol && previousBallPosition.row > ballBrickRow)			//DIAGONAL BOTTOM RIGHT
			{	//reflect
				ballSpeedY = -ballSpeedY
				ballSpeedX = -ballSpeedX
			}
			if(previousBallPosition.col != ballBrickCol)													//LEFT OR RIGHT
			{	//reflect
				ballSpeedX = -ballSpeedX
			}
			if(previousBallPosition.row != ballBrickRow)													//TOP OR BOTTOM
			{	//reflect
				ballSpeedY = -ballSpeedY
			}

			hitBrickScoring();										//scoring
		}
	}
}

function ballPaddleHandling(){
	for(var angle = 0; angle < 359; angle++){

		var x = ballX + ballRadius * Math.cos(Math.radians(angle));
		var y = ballY + ballRadius * Math.sin(Math.radians(angle));

		//reflect the ball off the paddle
		if(y >= paddleY &&							//below top of paddle
			y <= paddleY + paddleThickness &&		//above bottom of paddle
			x >= paddleX &&							//right of the left side of the paddle
			x <= paddleX + paddleLength){			//left of the right side of the paddle

			var previousBallY = y - ballSpeedY;
			var previousBallX = x - ballSpeedX;

			if(previousBallX < paddleX || previousBallX > paddleX + paddleLength &&		//diagonal x
			previousBallY < paddleY || previousBallY > paddleY + paddleThickness){		//diagonal y
				ballSpeedY = -ballSpeedY;
				ballSpeedX = -ballSpeedX;
			}else if(previousBallY < paddleY || previousBallY > paddleY + paddleThickness){						//y off, collision top or bottom
				ballSpeedY = -ballSpeedY;
			}

			//changing the X-Speed before won't matter, because it gets reassigned here anyways
			//that is why it is not needed to check the x (left or right collision)

			var paddleCenterX = paddleX + (paddleLength/2);			//make the X-Speed larger if the ball is hit further away from the center of the paddle
			var deltaX = x - paddleCenterX;
			ballSpeedX = deltaX/deflectionRate;

			hitPaddleScoring();										//scoring
		}
	}
}

function paddleMove(){
	if(leftArrowHeld){
		paddleX -= 4;
	}else if(rightArrowHeld){
		paddleX += 4;
	}
}

function moveEverything(){
	if(!showStartScreen && !showPauseScreen && !showEndScreen){			//if game is running

		paddleMove();
		ballMove();
		ballBrickHandling();
		ballPaddleHandling();

		if(timeLeft <= 0 || lives <= 0){
			showEndScreen = true;
		}else{
			timeLeft -= 1;
		}
	}

}

function rowColToArrayIndex(col, row){
	return col + brickCols * row;		//function to return index of brick at a column and a row
}

function drawBricks(){
	for(var eachRow=0;eachRow<brickRows;eachRow++) {			//two for loops to iterate through drawing the cols and rows
		for(var eachCol=0;eachCol<brickCols;eachCol++) {		//eachRow and eachCol are the loop variables

			var arrayIndex = rowColToArrayIndex(eachCol, eachRow);	//make a variable to map all bricks to an index

			if(brickGrid[arrayIndex]) {
				colorRect(brickWidth*eachCol+1, brickHeight*eachRow, brickWidth-brickGap, brickHeight-brickGap, rainbowColors[eachRow-3]);	//drawEverything rainbowColors[i] to loop throught the array
			}
		}
	}
}

function drawEverything(){
	//black canvas background
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	//game
	if(!showStartScreen && !showPauseScreen && !showEndScreen){
		//ball
		colorCircle(ballX, ballY, ballRadius, 'white');
		//player paddle
		colorRect(paddleX, paddleY, paddleLength, paddleThickness, 'gray');
		//bricks
		drawBricks();
		//text bottom right score
		drawText(score, canvas.width - 20, canvas.height - 20, 'end', 'red', '40px arial black');
		//text bottom left lives
		drawText(lives, 20, canvas.height - 20, 'start', 'red', '40px arial black');
	}

	//start screen
	if(showStartScreen){
		drawText('BRICK BREAKER', canvas.width/2, canvas.height/2, 'center', 'white', '80px comic sans ms');
		drawText('Press SPACE to play', canvas.width/2, canvas.height/4*3, 'center', 'white', '40px verdana');
	}
	//pause screen
	if(showPauseScreen){
		drawText('Game Paused', canvas.width/2, canvas.height/2, 'center', 'white', '80px arial black');
		drawText('Press SPACE to continue playing', canvas.width/2, canvas.height/4*3, 'center', 'white', '20px arial')

		/*
		//score detailed
		drawText('Score: ' + score, canvas.width - 20, canvas.height - 20, 'end', 'red', '30px arial black')
		if(lives < 1){
			drawText('No more lives left!', 20, canvas.height - 20, 'start', 'red', '30px arial black')
		}else{
			drawText('Lives left: ' + lives, 20, canvas.height - 20, 'start', 'red', '30px arial black')
		}
		*/
	}

	if(showEndScreen){
		drawText('Well done!', canvas.width/2, canvas.height/4, 'center', 'white', '25px arial black');
		drawText(score, canvas.width/2, canvas.height/4*3, 'center', 'magenta', '80px verdana');
	}

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
