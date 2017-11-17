var blueCarPic = document.createElement('img');
var trackWall = document.createElement('img');
var trackRoad = document.createElement('img');

//var picsToLoad = 0;		doesn't work because of race condition https://en.wikipedia.org/wiki/Race_condition
//in this case, the pictures would finish loading before the next one started loading -> counter goes back to zero and game initialises
//for multiple pictures, this can happen multiple times and the game's logic can run three times as often (setInterval function)
var picsToLoad = 3;

function checkLoadingComplete(){		//if all pictures have loaded game gets started
	picsToLoad --;
	//console.log(picsToLoad);
	if(picsToLoad == 0){
		//console.log('game intialising');
		initialiseGame();
	}
}

function beginLoadingImage(imgVar, filePath){
	//picsToLoad++;
	imgVar.onload = checkLoadingComplete();
	imgVar.src = filePath;
}

function loadImages(){
	beginLoadingImage(trackWall, 'track_wall.png');
	beginLoadingImage(trackRoad, 'track_road.png');
	beginLoadingImage(blueCarPic, 'blueCarPic.png');
}