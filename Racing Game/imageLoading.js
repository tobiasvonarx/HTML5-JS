var blueCarPic = document.createElement('img');
var trackWall = document.createElement('img');
var trackRoad = document.createElement('img');

var picsToLoad = 3;

function checkLoadingComplete(){		//if all pictures have loaded game gets started
	picsToLoad --;
	console.log(picsToLoad);
	if(picsToLoad == 0){
		console.log('game intialising');
		initialiseGame();
	}
}

function carImageLoad(){
	blueCarPic.onload = checkLoadingComplete();
	blueCarPic.src = 'blueCarPic.png';
}

function trackImageLoad(){
	trackWall.onload = checkLoadingComplete();
	trackWall.src = 'track_wall.png';
	trackRoad.onload = checkLoadingComplete();
	trackRoad.src = 'track_road.png';
}

function loadImages(){
	carImageLoad();
	trackImageLoad();
}