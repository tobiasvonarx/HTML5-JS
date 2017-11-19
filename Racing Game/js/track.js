const trackSize = 40;
const trackCols = 20;
const trackRows = 15;
const trackGap = 0;
const finishLineColors = ['white', 'black'];
const trackGrid = [ 6, 6, 6, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 6,
                    6, 6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    6, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
                    1, 0, 0, 0, 7, 1, 1, 6, 6, 6, 6, 6, 1, 1, 1, 1, 7, 0, 0, 1,
                    1, 0, 0, 1, 1, 0, 0, 1, 6, 6, 6, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 0, 0, 1, 6, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 7, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 7, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 7, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                    1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 7, 0, 0, 1,
                    1, 2, 3, 7, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                    1, 5, 5, 5, 0, 0, 1, 6, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1,
                    1, 0, 0, 0, 0, 0, 1, 6, 6, 1, 1, 1, 6, 6, 1, 0, 0, 0, 0, 1,
                    6, 1, 1, 1, 1, 1, 6, 6, 6, 6, 6, 6, 6, 6, 6, 1, 1, 1, 1, 6];

const roadTile = 0;
const wallTile = 1;
const treeTile = 6;
const flagTile = 7;
const waymarkTile = 4;
const antiCheatTile = 5;
const firstPlayerStartTile = 2;
const secondPlayerStartTile = 3;


function isObstacleAtColRow(col, row) {
    if(col >= 0 && col < trackCols &&                       //no bugs
            row >= 0 && row < trackRows) {
            var trackIndexUnderCoord = rowColToArrayIndex(col, row);
            var tile = trackGrid[trackIndexUnderCoord];

            //anticheat system
            if(waymarkReached && (tile==firstPlayerStartTile||tile==secondPlayerStartTile)){          //if waymark reached and finish line crossed
                    finishLineReached = true;
                    showEndScreen = true;
            } else if(tile==waymarkTile){                                                                                        //if waymark reached
                    waymarkReached = true;
            }

            //check if car hit obstacle
            if(!waymarkReached){
                    return (tile==wallTile||tile==antiCheatTile||tile==treeTile||tile==flagTile);
            } else {                                                                                                            //waymark reached
                    return(tile==wallTile||tile==treeTile||tile==flagTile);
            }
    } else {
            return false;
    }
}



function carTrackHandling(){
    var carTrackCol = Math.floor(carX / trackSize);
    var carTrackRow = Math.floor(carY / trackSize);
    var trackIndexUnderCar = rowColToArrayIndex(carTrackCol, carTrackRow);

    if(carTrackCol >= 0 && carTrackCol < trackCols &&                       //no bugs
        carTrackRow >= 0 && carTrackRow < trackRows) {

        if(isObstacleAtColRow(carTrackCol, carTrackRow)) {                  //wall
            carX -= Math.cos(carAng) * carSpeed;
            carY -= Math.sin(carAng) * carSpeed;
            carSpeed *= -0.6;
        }
    }
}


function rowColToArrayIndex(col, row){
    return col + trackCols * row;           //function to return index of track at a column and a row
}

function drawTracks(){
    for(var eachRow=0;eachRow<trackRows;eachRow++) {                        //two for loops to iterate through drawing the cols and rows
        for(var eachCol=0;eachCol<trackCols;eachCol++) {                //eachRow and eachCol are the loop variables

            var arrayIndex = rowColToArrayIndex(eachCol, eachRow);  //make a variable to map all tracks to an index
            var tile = trackGrid[arrayIndex];
            var useImage;
            
            switch(tile){
                case roadTile:
                case waymarkTile:
                case antiCheatTile:
                    useImage = trackRoad;
                    break;
                case wallTile:
                    useImage = trackWall;
                    break;
                case firstPlayerStartTile:
                case secondPlayerStartTile:
                    useImage = trackGoal;
                    break;
                case treeTile:
                    useImage = trackTree;
                    break;
                case flagTile:
                    useImage = trackFlag;
                    break;
            }
            canvasContext.drawImage(useImage, trackSize*eachCol, trackSize*eachRow);
        }
    }
}
