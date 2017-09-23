 /*			VERSION 20170923
TODO:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
*/

const fps = 125;	
var canvas = document.getElementById('gameCanvas');
var canvasContext = canvas.getContext('2d');
const netWidth = 2;
const netSegmentHeight = 20;
const paddleHeight = 80;
const paddleWidth = 10;
var paddle1Y = (canvas.height/2)-(paddleHeight/2);
var paddle2Y = (canvas.height/2)-(paddleHeight/2);
const paddleDistanceFromSide = paddleWidth;
const ballDiameter = 10;
const ballRadius = ballDiameter/2
var ballX;			//Define these in ballReset()
var ballY;
var ballSpeedX;
var ballSpeedY;
var aISpeedY = 2;
var playerScore = 0;
var aIScore = 0;
const deflectionRate = 15;				//The higher, the LESS deflection
const winningScore = 3;
var showingWinScreen = false;

//Variables declared outside a funcion are stored the whole duration of the script
//Variables declared inside a function are only stored while the function is open/running

function ballReset(){
	if(playerScore == winningScore || aIScore == winningScore){
		showingWinScreen = true;
	}

	ballSpeedX = 2;
	ballSpeedY = 2;
	ballX = canvas.width/4;
	ballY = canvas.height/2;
}

function calculateMousePos(event){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	//var mouseX = event.clientX - rect.left - root.scrollLeft;
	var mouseY = event.clientY - rect.top - root.scrollTop;
	return{
		//x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(event){
	if(showingWinScreen){
		playerScore = 0;
		aIScore = 0;
		showingWinScreen = false;
	}
}

window.onload = function(){
	ballReset();
	//setInterval calls moveEverything & drawEverything in an 'in-line function'
	setInterval(function(){moveEverything();drawEverything();}, 1000/fps);
	
	canvas.addEventListener('mousedown', handleMouseClick);

	canvas.addEventListener('mousemove',
		function(event){
			var mousePos = calculateMousePos(event);
			paddle1Y = mousePos.y-(paddleHeight/2);
		});
}

function aIMovement(){
	var paddle2YCenter = paddle2Y + (paddleHeight/2);
	if(paddle2YCenter < ballY - (paddleHeight/3)){
		paddle2Y += aISpeedY;
	}
	else if(paddle2YCenter > ballY + (paddleHeight/3)){
		paddle2Y -= aISpeedY;
	}									
}

function moveEverything(){
	if(showingWinScreen){
		return;
	}

	aIMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX + ballRadius >= canvas.width - paddleWidth - paddleDistanceFromSide &&				//right paddle collision
		ballY + ballRadius >= paddle2Y && ballY - ballRadius <= paddle2Y + paddleHeight)
	{
		ballSpeedX = -ballSpeedX;																//reflect the ball

		var deltaY = ballY - (paddle2Y + paddleHeight/2);										//return at an steeper angle if hit at the edge
		ballSpeedY = deltaY/deflectionRate;
	}

	if(ballX - ballRadius <= paddleWidth + paddleDistanceFromSide &&							//left paddle collision
		ballY + ballRadius >= paddle1Y && ballY - ballRadius <= paddle1Y + paddleHeight)
	{
		ballSpeedX = -ballSpeedX;																//reflect the ball

		var deltaY = ballY - (paddle1Y + paddleHeight/2);										//return at an steeper angle if hit at the edge
		ballSpeedY = deltaY/deflectionRate;
	}

	if(ballY + ballRadius >= canvas.height){				//bottom collision
		ballSpeedY = -ballSpeedY;
	}
	if(ballY - ballRadius <= 0){							//top collision
		ballSpeedY = -ballSpeedY;
	}
	if(ballX + ballRadius >= canvas.width){					//player scores
		playerScore++;
		ballReset();
	}
	if(ballX - ballRadius <= 0){							//aI scores
		aIScore++;
		ballReset();
	}
}
function drawEverything(){
	//black background
	colorRect(0, 0, canvas.width, canvas.height, 'black');

	//end screen
	if(showingWinScreen){
		if(playerScore == winningScore){
			addText('Congratulations, you won!', canvas.width/2, canvas.height/2, 'center', '40px Arial Black', 'white');
			addText('Click to play again', canvas.width/2, 3*(canvas.height/4), 'center', '20px Arial', 'white');
		} 
		else if(aIScore == winningScore){
			addText('Game Over...', canvas.width/2, canvas.height/2, 'center', '40px Arial Black', 'white');
			addText('Click to try again', canvas.width/2, 3*(canvas.height/4), 'center', '20px Arial', 'white');
		}
		return;
	}

	//net
	drawNet();
	//left paddle
	colorRect(paddleDistanceFromSide, paddle1Y, paddleWidth, paddleHeight, 'white');
	//right paddle
	colorRect(canvas.width-paddleWidth-paddleDistanceFromSide, paddle2Y, paddleWidth, paddleHeight, 'white');
	//ball
	colorCircle(ballX, ballY, ballRadius, 'white');
	//player score
	addText(playerScore + ' ', canvas.width/2, canvas.height/4, 'end', '80px Arial Black', 'white');
	//aI score
	addText(' ' + aIScore, canvas.width/2, canvas.height/4, 'start', '80px Arial Black', 'white');
}

function drawNet(){
	for(var i=10;i<canvas.height; i+=40){															//i starts at 10 only so the broken line is symetrical
		colorRect((canvas.width/2)-(netWidth/2), i, netWidth, netSegmentHeight, 'white')
	}
}

function addText(text, X, Y, alignment, font, drawColor){
	canvasContext.font = font;
	canvasContext.fillStyle = drawColor;
	canvasContext.textAlign = alignment;
	canvasContext.fillText(text, X, Y);	
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
