//INSTRUCTION TO LOADING IMAGES:

//car pic:
//1. create img element at top
//2. reference var and file path in imageData array as object literal

//track pic:
//1. instantiate the new tile to corresponding number in track.js
//2. add object literal with file path and the trackType (holding the corresponding number) to imageData array
//3. mention the assigned integer in trackGrid to draw it someplace

// var blueCarPicBrake = document.createElement('img');
var blueCarPicIdle = document.createElement('img');
// var greenCarPicBrake = document.createElement('img');
// var greenCarPicIdle = document.createElement('img');

var trackPics = []

var picsToLoad;	//set automatically based length of imageData array in loadImages()

function checkLoadingComplete(){		//if all pictures have loaded game gets started
	picsToLoad --;
	//console.log(picsToLoad)
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
	var imageData = [												//data structure for storing neccessary image information
		// {var: blueCarPicBrake,file:'blueCarPicBrake.png'},
		{var: blueCarPicIdle,file:'blueCarPicIdle.png'},
		// {var: greenCarPicBrake,file:'greenCarPicBrake.png'},
		// {var: greenCarPicIdle,file:'greenCarPicIdle.png'},
		{trackType: wallTile,file:'track_wall.png'},				//object literal (=hashtable or =dictionary)
		{trackType: roadTile,file:'track_road.png'},
		{trackType: waymarkTile,file:'track_road.png'},
		{trackType: antiCheatTile,file:'track_road.png'},
		{trackType: firstPlayerStartTile,file: 'track_goal.png'},
		{trackType: secondPlayerStartTile,file: 'track_goal.png'},
		{trackType: treeTile,file: 'track_tree.png'},
		{trackType: treeTile2,file: 'track_tree2.png'},
		{trackType: flagTile,file: 'track_flag.png'}
	];

	picsToLoad = imageData.length;

	for(var i=0;i<imageData.length;i++){
		if(imageData[i].var != undefined){
			beginLoadingImage(imageData[i].var, imageData[i].file);
		} else{
			loadImageForTrackCode(imageData[i].trackType, imageData[i].file);
		}
	}
}

function loadImageForTrackCode(trackCode,file){					//trackCode contains index variable of tile type
	trackPics[trackCode] = document.createElement('img');		//img variable created
	beginLoadingImage(trackPics[trackCode],file);
}