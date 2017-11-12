var blueCarPic = document.createElement('img');
var blueCarPicLoaded = false;

var trackWall = document.createElement('img');
var trackRoad = document.createElement('img');

function carImageLoad(){
	blueCarPic.onload = function(){
		blueCarPicLoaded = true;
	};

	blueCarPic.src = 'blueCarPic.png';
}

function trackImageLoad(){
	trackWall.src = 'track_wall.png';
	trackRoad.src = 'track_road.png';
}

function loadImages(){
	carImageLoad();
	trackImageLoad();
}