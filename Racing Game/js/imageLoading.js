var blueCarPic = document.createElement('img');
var trackWall = document.createElement('img');
var trackRoad = document.createElement('img');

var picsToLoad;	//set automatically based length of imageData array in loadImages()

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
	imgVar.src = 'images/'+filePath;
}

function loadImages(){
	var imageData = [									//data structure for storing neccessary image information
		{var: trackWall,file:'track_wall.png'},			//object literal (=hashtable or =dictionary)
		{var: trackRoad,file:'track_road.png'},
		{var: blueCarPic,file:'blueCarPic.png'}
	];

	picsToLoad = imageData.length;

	for(var i=0;i<imageData.length;i++){
		beginLoadingImage(imageData[i].var, imageData[i].file);
	}
}