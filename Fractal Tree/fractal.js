Math.radians = function(degrees){
  return degrees * Math.PI / 180;
};

var angle = Math.radians(22)
var canvas;
var canvasContext;

window.onload = function(){
  canvas = document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');
  draw();
};

function draw() {
  //colorRect(0,0,canvas.width,canvas.height,'#333')
  canvasContext.translate(canvas.width/2, canvas.height);
  branch(canvas.height/4, 3);
}

function branch(len, width) {
  console.log(len, width);
  drawLine(0, 0, 0, -len, width, '#fff');
  canvasContext.translate(0, -len);
  if (len > 3) {
    canvasContext.save();
    canvasContext.rotate(angle);
    branch(len * 0.7, width-0.2);
    canvasContext.restore();
    canvasContext.save();
    canvasContext.rotate(-angle);
    branch(len * 0.7, width-0.2);
    canvasContext.restore();
  }
}

function drawLine(fromX, fromY, toX, toY, lineThickness, drawColor){
  canvasContext.lineWidth = lineThickness;
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.moveTo(fromX,fromY);
  canvasContext.lineTo(toX,toY);
  canvasContext.stroke();
}

function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
