function handleKeyDown(event){	
	switch(event.keyCode){
		case 32:			//SPACE or ENTER
			if(showStartScreen){
				setup();
				showStartScreen = false;
			}else if(showPauseScreen){
				showPauseScreen = false;
			}//else if(showEndScreen){
			//	setup();
			//}
			break;
		case 13:
			if(showStartScreen){
					setup();
					showStartScreen = false;
				}else if(showPauseScreen){
					showPauseScreen = false;
				}//else if(showEndScreen){
				//	setup();
				//}
			break;
	}
	if(!showStartScreen && !showEndScreen){		//game is running
		switch(event.keyCode){
			case 27:												//esc
				showPauseScreen = true;
				break;
			case 37: 												//left arrow  	
				keyHeldTurnLeft = true;
				carMoved = true;
				break;	
			case 38: 												//up arrow
				keyHeldGas = true;
				carMoved = true;
				break;
			case 39: 												//right arrow
				keyHeldTurnRight = true;
				carMoved = true;
				break;
			case 40: 												//down arrow
				keyHeldBrakes = true;
				carMoved = true;
				break;
			case 87: 												//w	
				keyHeldGas = true;
				carMoved = true;
				break;	
			case 65: 												//a
				keyHeldTurnLeft = true;
				carMoved= true;
				break;
			case 83: 												//s
				keyHeldBrakes = true;
				carMoved = true;
				break;
			case 68: 												//d
				keyHeldTurnRight = true;
				carMoved = true;
				break;
			case 82: 												//r
				setup();
				break;
		}
	}
}

function handleKeyUp(event){
	if(showStartScreen == false && showEndScreen == false){		//game is running
		switch(event.keyCode){
			case 37:
				keyHeldTurnLeft = false;					//left arrow
				break;
			case 38:
				keyHeldGas = false;							//up arrow
				break;
			case 39:
				keyHeldTurnRight = false;					//right arrow
				break;
			case 40:
				keyHeldBrakes = false;						//down arrow
				break;

			case 87:
				keyHeldGas = false;									//w
				break;
			case 65:
				keyHeldTurnLeft = false;							//a
				break;
			case 83:
				keyHeldBrakes = false;								//s
				break;
			case 68:
				keyHeldTurnRight = false;							//d
				break;
		}
	}
}