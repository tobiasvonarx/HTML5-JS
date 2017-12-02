const keyW = 87;
const keyA = 65;
const keyS = 83;
const keyD = 68;
const keyLeftArrow = 37;
const keyUpArrow = 38;
const keyRightArrow = 39;
const keyDownArrow = 40;

function setupInput(){
	//keyboard event detection
	window.addEventListener('keydown', handleKeyDown);
	window.addEventListener('keyup', handleKeyUp);
}

function keyInput(car, setTo, event){
	if(!showStartScreen && !showEndScreen){		//game is running
		switch(event.keyCode){
			case car.controlKeyTurnLeft: 												//left arrow  	
				car.keyHeldTurnLeft = setTo;
				break;	
			case car.controlKeyGas: 													//up arrow
				car.keyHeldGas = setTo;
				car.moved = true;
				break;
			case car.controlKeyTurnRight: 												//right arrow
				car.keyHeldTurnRight = setTo;
				break;
			case car.controlKeyBrakes: 													//down arrow
				car.keyHeldBrakes = setTo;
				car.moved = true;
				break;
		}
	}
}

function handleKeyDown(evt){	
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
		case 27: 				//esc
			if(!showStartScreen && !showEndScreen){
				showPauseScreen = true;
			}
			break;
		case 82: 				//r
			if(!showStartScreen && !showEndScreen){
				setup();
			}
			break;
	}
	keyInput(blueCar,true,evt);
	keyInput(greenCar,true,evt);

}

function handleKeyUp(evt){
	keyInput(blueCar,false,evt);
	keyInput(greenCar,false,evt);
}