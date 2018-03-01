let origBoard;
let moves;
const oPlayer = 'O';
const xPlayer = 'X';
const cellCountX = 5;
const cellCountY = 5;
let winner;

const cells = document.querySelectorAll('.cell');
disableSelection(document.body);
startGame();

function disableSelection(target){
    if (typeof target.onselectstart!="undefined") //IE route
        target.onselectstart=function(){return false}

    else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
        target.style.MozUserSelect="none"

    else //All other route (ie: Opera)
        target.onmousedown=function(){return false}

    target.style.cursor = "default"
}

function startGame() {
	winner = '';
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(25).keys());
	moves = 0;
	for (let i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

function turnClick(square) {
	moves++;
	if (moves%2==0) {
		turn(square.target.id, oPlayer);	
	} else {
		turn(square.target.id, xPlayer);	
	}
}

function turn(squareId, player) {
	try {
		let cellContent = cells[origBoard[squareId]].innerText;		//throws an error if cell is already occupied
		origBoard[squareId] = player;
		document.getElementById(squareId).innerText = player;
	} catch(error) {												//reacts upon occupied cell error catch
		moves--;
	}
	if (gameCompleted(squareId)) {
		showWinner();
	}
}

function gameCompleted(id) {
	let player = origBoard[id];
	for (let i=0; i<25; i++) {
		//BOTTOM LEFT DIAGONALS
		let leftDiagonalA = i+cellCountX-1;
		let leftDiagonalB = i+2*cellCountX-2;
		//console.log(cell, leftDiagonalA, leftDiagonalB);

		if (origBoard[i]==origBoard[leftDiagonalA]&&origBoard[i]==origBoard[leftDiagonalB]) {
			showWinner(player);
		}
		//BOTTOM RIGHT DIAGONALS
		let rightDiagonalA = i+cellCountX+1;
		let rightDiagonalB = i+2*cellCountX+2;
		//console.log(cell, rightDiagonalA, rightDiagonalB);

		if (origBoard[i]==origBoard[rightDiagonalA]&&origBoard[i]==origBoard[rightDiagonalB]) {
			showWinner(player);
		}
	}
}

function showWinner(player) {
	console.log(player+' won the game!');
	document.getElementById('winner').innerText = player + ' won the game!';
	startGame();
}