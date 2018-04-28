const trackSize = 40;
const trackCols = 20;
const trackRows = 15;
const trackGap = 0;
const levelOne = [	8, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
					6, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 6, 1, 1, 1, 1, 1, 0, 0, 0, 1,
					1, 0, 0, 0, 7, 1, 8, 1, 1, 6, 8, 6, 1, 1, 6, 1, 7, 0, 0, 1,
					1, 0, 0, 1, 1, 0, 0, 1, 6, 8, 6, 1, 0, 0, 0, 0, 1, 0, 0, 1,
					1, 0, 0, 1, 0, 0, 0, 0, 1, 6, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
					8, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 7, 0, 0, 1, 0, 0, 1,
					6, 0, 0, 1, 0, 0, 7, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
					1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 7, 0, 0, 1, 0, 0, 1, 0, 0, 1,
					1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 0, 1,
					6, 2, 3, 7, 4, 4, 1, 6, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
					1, 5, 5, 5, 0, 0, 8, 8, 1, 0, 0, 0, 1, 8, 0, 0, 0, 0, 0, 1,
					1, 0, 0, 0, 0, 0, 1, 8, 6, 1, 6, 8, 8, 6, 1, 0, 0, 0, 0, 1,
					1, 1, 1, 1, 1, 1, 8, 6, 8, 6, 8, 8, 6, 8, 1, 1, 1, 1, 8, 6
];

const tileScoreGrid = [ -300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,
						-300,-300,-300, 45 , 50 , 55 , 65 , 70 , 75 , 80 , 85 , 90 , 95 ,100 ,105 ,110 ,115 ,120 ,110 ,-300,
						-300,-300, 40 , 45 , 50 , 55 , 65 , 70 , 75 , 80 , 85 , 90 , 95 ,100 ,105 ,110 ,115 ,120 ,120 ,-300,
						-300, 30 , 40 , 45 , 45 ,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,115 ,120 ,120 ,-300,
						-300, 30 , 35 , 40 ,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,125 ,125 ,-300,
						-300, 30 , 30 ,-300,-300,200 ,200 ,-300,-300,-300,-300,-300,195 ,195 ,195 ,195 ,-300,125 ,125 ,-300,
						-300, 25 , 25 ,-300,200 ,200 ,200 ,200 ,-300,-300,-300,200 ,200 ,200 ,200 ,195 ,-300,135 ,135 ,-300,
						-300, 20 , 20 ,-300,200 ,200 ,200 ,200 ,200 ,-300,-300,200 ,200 ,-300,195 ,195 ,-300,140 ,140 ,-300,
						-300, 15 , 15 ,-300,200 ,200 ,-300,200 ,200 ,200 ,-300,200 ,200 ,-300,190 ,190 ,-300,145 ,145 ,-300,
						-300, 10 , 10 ,-300,200 ,200 ,-300,-300,200 ,200 ,-300,200 ,200 ,-300,185 ,185 ,-300,150 ,150 ,-300,
						-300,  5 ,  5 ,-300,200 ,200 ,-300,-300,200 ,200 ,200 ,200 ,200 ,-300,180 ,180 ,-300,155 ,155 ,-300,
						-300,-300,-300,-300,-300,-300,-300,-300,200 ,200 ,200 ,200 ,200 ,-300,175 ,175 ,170 ,160 ,160 ,-300,
						-300,-300,-300,-300,200 ,200 ,-300,-300,-300,200 ,200 ,200 ,-300,-300,170 ,170 ,170 ,165 ,160 ,-300,
						-300,200 ,200 ,200 ,200 ,200 ,-300,-300,-300,-300,-300,-300,-300,-300,-300,160 ,160 ,160 ,160 ,-300,
						-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300,-300

];
let trackGrid = [];

const roadTile = 0;
const wallTile = 1;
const treeTile = 6;
const treeTile2 = 8;
const flagTile = 7;
const waymarkTile = 4;
const antiCheatTile = 5;
const firstPlayerStartTile = 2;
const secondPlayerStartTile = 3;

function returnTileTypeAtColRow(col, row) {
	if (col >= 0 && col < trackCols && // no bugs
		row >= 0 && row < trackRows) {
		let trackIndexUnderCoord = colRowToArrayIndex(col, row);
		let tile = trackGrid[trackIndexUnderCoord];
		return tile;
	} else {
		return wallTile;
	}
}

function carTrackHandling(car) {
	let carTrackCol = Math.floor(car.x / trackSize);
	let carTrackRow = Math.floor(car.y / trackSize);
	let trackIndexUnderCar = colRowToArrayIndex(carTrackCol, carTrackRow);

	if (carTrackCol >= 0 && carTrackCol < trackCols && // no bugs
		carTrackRow >= 0 && carTrackRow < trackRows) {

		let tile = returnTileTypeAtColRow(carTrackCol, carTrackRow);
		let hitObstacle;

		car.setPreviousPositions(trackIndexUnderCar, tile);

		// anticheat system
		if (car.waymarkReached && (tile == firstPlayerStartTile || tile == secondPlayerStartTile)) { // if waymark reached and finish line crossed
			car.finishLineReached = true;
			showEndScreen = true;
		} else if (tile == waymarkTile) { // if waymark reached
			car.waymarkReached = true;
		}

		// check if car hit obstacle
		if (!car.waymarkReached) {
			hitObstacle = tile == wallTile || tile == antiCheatTile || tile == treeTile || tile == flagTile || tile == treeTile2;
		} else { // waymark reached
			hitObstacle = tile == wallTile || tile == treeTile || tile == flagTile || tile == treeTile2;
		}

		if (hitObstacle) { // wall
			car.x -= Math.cos(car.ang) * car.speed;
			car.y -= Math.sin(car.ang) * car.speed;
			car.speed *= -0.4;
		}
	}
}

function colRowToArrayIndex(col, row) {
	return col + trackCols * row; // function to return index of track at a column and a row
}

function drawTracks() {
	let arrayIndex = 0;
	let drawTileX = 0;
	let drawTileY = 0;

	for (let eachRow = 0; eachRow < trackRows; eachRow++) { // two for loops to iterate through drawing the cols and rows

		for (let eachCol = 0; eachCol < trackCols; eachCol++) { // eachRow and eachCol are the loop variables
			let tileKind = trackGrid[arrayIndex];
			let useImage = trackPics[tileKind];
			canvasContext.drawImage(useImage, drawTileX, drawTileY); // draw

			drawTileX += trackSize;
			arrayIndex++;
		}
		drawTileY += trackSize;
		drawTileX = 0;
	}
}
