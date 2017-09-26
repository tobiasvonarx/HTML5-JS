const trackSize = 40;
const trackCols = 20;
const trackRows = 15;
const trackGap = 0;
const finishLineColors = ['white', 'black'];
const trackGrid = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
                 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 1,
                 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1,
                 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1,
                 1, 2, 3, 1, 4, 4, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                 1, 5, 5, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1,
                 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1,
                 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1];
const trackTile = 0;
const grassTile = 1;
const waymarkTile = 4;
const antiCheatTile = 5;
const firstPlayerStartTile = 2;
const secondPlayerStartTile = 3;


function isWallAtColRow(col, row) {
        if(col >= 0 && col < trackCols &&                       //no bugs
                row >= 0 && row < trackRows) {
                var trackIndexUnderCoord = rowColToArrayIndex(col, row);

                if(waymarkReached && (trackGrid[trackIndexUnderCoord]==firstPlayerStartTile||trackGrid[trackIndexUnderCoord]==secondPlayerStartTile)){          //if waymark reached and finish line crossed
                        finishLineReached = true;
                } else if(trackGrid[trackIndexUnderCoord]==waymarkTile){                                                                                                                //if waymark reached
                        waymarkReached = true;
                }

                if(!waymarkReached){
                        return (trackGrid[trackIndexUnderCoord]==grassTile||trackGrid[trackIndexUnderCoord]==antiCheatTile);
                } else {                                                                                        //waymark reached
                        return(trackGrid[trackIndexUnderCoord]==grassTile);
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

                if(isWallAtColRow(carTrackCol, carTrackRow)) {                  //wall

                        carX -= Math.cos(carAng) * carSpeed;
                        carY -= Math.sin(carAng) * carSpeed;
                        carSpeed *= -0.5;
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
                        
                        if(trackGrid[arrayIndex]==trackTile){                                   //track
                                colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'gray');
                        }else if(trackGrid[arrayIndex]==grassTile){                             //grass
                                colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'green');
                        }else if(trackGrid[arrayIndex]==firstPlayerStartTile || trackGrid[arrayIndex]==secondPlayerStartTile){                          //flag
                                for(var i=0;i<trackSize;i+=trackSize/5){                        //row
                                        for(var j=0;j<trackSize;j+=trackSize/5){                //column
                                                colorRect(trackSize*eachCol+i, trackSize*eachRow+j, trackSize/5, trackSize/5, finishLineColors[1]);
                                                finishLineColors.reverse();                                     //change colors
                                        }
                                }
                        }else if(trackGrid[arrayIndex]==waymarkTile){
                                colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'gray');        //waymark (to prevent cheating)
                        }else if(trackGrid[arrayIndex]==antiCheatTile){
                                colorRect(trackSize*eachCol, trackSize*eachRow, trackSize-trackGap, trackSize-trackGap, 'gray');        //blocking the player to go behind the finish/starting line at beginning
                        }
                }
        }
}
