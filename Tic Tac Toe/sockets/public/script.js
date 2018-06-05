//TODO: top overshooting not flawless
// 		check for overshooting bugs in general
//		improve code elegancy and make it more concise

const socket = io('http://localhost:3000');

let origBoard;
let moves;
const oPlayer = 'O';
const xPlayer = 'X';
const cellCountX = 5;
const cellCountY = 5;
let winner;

const cells = document.querySelectorAll('.cell');
startGame();

((target) => {
    if (typeof target.onselectstart!="undefined") //IE route
        target.onselectstart=function(){return false}

    else if (typeof target.style.MozUserSelect!="undefined") //Firefox route
        target.style.MozUserSelect="none"

    else //All other route (ie: Opera)
        target.onmousedown=function(){return false}

    target.style.cursor = "default"
})(document.body);

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
	let rCol = [4,9,14,19,24];
	let lCol = [0,5,10,15,20];
	for (let i=0; i<25; i++) {
		//BOTTOM LEFT DIAGONALS
		let leftDiagonalA = i+cellCountX-1;
		let leftDiagonalB = leftDiagonalA+cellCountX-1;
		let leftDiagonalC = leftDiagonalB+cellCountX-1;

		//BOTTOM RIGHT DIAGONALS
		let rightDiagonalA = i+cellCountX+1;
		let rightDiagonalB = rightDiagonalA+cellCountX+1
		let rightDiagonalC = rightDiagonalB+cellCountX+1;

		if (typeof origBoard[i]=='string') {
			//check for LEFT DIAGONAL overshoot
			//bottom overshoot with left diagonal
			if (leftDiagonalA>24) {
				leftDiagonalA -= cellCountX*cellCountY;
				leftDiagonalB = leftDiagonalA+cellCountX-1;
				leftDiagonalC = leftDiagonalB+cellCountX-1;
			} else if (leftDiagonalB>24) {
				leftDiagonalB -= cellCountX*cellCountY;
				leftDiagonalC = leftDiagonalB+cellCountX-1;
			} else if (leftDiagonalC>24) {
				leftDiagonalC -= cellCountX*cellCountY;
			}			
			//check if a diagonal or the cell itself is on a corner here
			if (rCol.includes(leftDiagonalA) || rCol.includes(leftDiagonalB) || rCol.includes(leftDiagonalC)) {
				//check right edges before corners
				if (rCol.includes(leftDiagonalA)) {
					leftDiagonalA += cellCountX;
					leftDiagonalB = leftDiagonalA+cellCountX-1;
					leftDiagonalC = leftDiagonalB+cellCountX-1;
				} else if (rCol.includes(leftDiagonalB)) {
					leftDiagonalB += cellCountX;
					leftDiagonalC = leftDiagonalB+cellCountX-1;
				} else if (rCol.includes(leftDiagonalC)) {
					leftDiagonalC += cellCountX;
				}
			}

			//check if there is an overshoot on the bottom left tile
			if (i == 20) {
				leftDiagonalA = 4;
				leftDiagonalB = leftDiagonalA+cellCountX-1;
				leftDiagonalC = leftDiagonalB+cellCountX-1;
			} else if (leftDiagonalA == 20) {
				leftDiagonalB = 4;
				leftDiagonalC = leftDiagonalB+cellCountX-1;
			} else if (leftDiagonalB == 20) {
				leftDiagonalC = 4;
			} //check if there is an overshoot on the bottom right tile 
			else if (i == 24) {
				leftDiagonalA = 3;
				leftDiagonalB = leftDiagonalA+cellCountX-1;
				leftDiagonalC = leftDiagonalB+cellCountX-1;
			} else if (leftDiagonalA == 24) {
				leftDiagonalB = 3;
				leftDiagonalC = leftDiagonalB+cellCountX-1;
			} else if (leftDiagonalB == 24) {
				leftDiagonalC = 3;
			}
			
			console.log('cell: ',i);
			console.log('left diagonals are: ');
			console.log(leftDiagonalA+' '+leftDiagonalB+' '+leftDiagonalC);
			//check for RIGHT DIAGONAL overshoot
			//bottom overshoot with right diagonal
			if (rightDiagonalA>24) {
				rightDiagonalA -= cellCountX*cellCountY;
				rightDiagonalB = rightDiagonalA+cellCountX+1;
				rightDiagonalC = rightDiagonalB+cellCountX+1;
			} else if (rightDiagonalB>24) {
				rightDiagonalB -= cellCountX*cellCountY;
				rightDiagonalC = rightDiagonalB+cellCountX+1;
			} else if (rightDiagonalC>24) {
				rightDiagonalC -= cellCountX*cellCountY;
			}					
			//check if a diagonal or the cell itself is on a corner here
			if (lCol.includes(rightDiagonalA) || lCol.includes(rightDiagonalB) || lCol.includes(rightDiagonalC)) {
				console.log('edge rightdiagonal');
				//check left edges before corners
				if (lCol.includes(rightDiagonalA)) {
					rightDiagonalA -= cellCountX;
					rightDiagonalB = rightDiagonalA+cellCountX+1;
					rightDiagonalC = rightDiagonalB+cellCountX+1;
				} else if (lCol.includes(rightDiagonalB)) {
					rightDiagonalB -= cellCountX;
					rightDiagonalC = rightDiagonalB+cellCountX+1;
				} else if (lCol.includes(rightDiagonalC)) {
					rightDiagonalC -= cellCountX;
				}
			}
				//check if there is an overshoot on the bottom left tile
			if (i == 20) {
				rightDiagonalA = 1;
				rightDiagonalB = rightDiagonalA+cellCountX+1;
				rightDiagonalC = rightDiagonalB+cellCountX+1;
			} else if (rightDiagonalA == 20) {
				rightDiagonalB = 1;
				rightDiagonalC = rightDiagonalB+cellCountX+1;
			} else if (rightDiagonalB == 20) {
				rightDiagonalC = 1;
			} //check if there is an overshoot on the bottom right tile 
			else if (i == 24) {
				rightDiagonalA = 0;
				rightDiagonalB = rightDiagonalA+cellCountX+1;
				rightDiagonalC = rightDiagonalB+cellCountX+1;
			} else if (rightDiagonalA == 24) {
				rightDiagonalB = 0;
				rightDiagonalC = rightDiagonalB+cellCountX+1;
			} else if (rightDiagonalB == 24) {
				rightDiagonalC = 0;
			}

			console.log('right diagonals are: ');
			console.log(rightDiagonalA+' '+rightDiagonalB+' '+rightDiagonalC);

		}

		//console.log(cell, rightDiagonalA, rightDiagonalB);
		if ((origBoard[i]==origBoard[leftDiagonalA]&&origBoard[i]==origBoard[leftDiagonalB]&&origBoard[i]==origBoard[leftDiagonalC])||
			(origBoard[i]==origBoard[rightDiagonalA]&&origBoard[i]==origBoard[rightDiagonalB]&&origBoard[i]==origBoard[rightDiagonalC])) {
			showWinner(player);
		}
	}
}

function showWinner(player) {
	//console.log(player+' won the game!');
	document.getElementById('winner').innerText = player + ' won the game!';
	startGame();
}
