var blueCarPic = document.createElement('img');

var trackPics = []

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
		{var: blueCarPic,file:'blueCarPic.png'},
		{trackType: wallTile,file:'track_wall.png'},			//object literal (=hashtable or =dictionary)
		{trackType: roadTile,file:'track_road.png'},
		{trackType: waymarkTile,file:'track_road.png'},
		{trackType: antiCheatTile,file:'track_road.png'},
		{trackType: firstPlayerStartTile,file: 'track_goal.png'},
		{trackType: secondPlayerStartTile,file: 'track_goal.png'},
		{trackType: treeTile,file: 'track_tree.png'},
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