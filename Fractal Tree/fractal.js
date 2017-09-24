/*    VERSION 20170924
TODO------------------------------------------
Add a slider for thickness
(Add a slider for angle)
-->should work, but the fractal doesn't render continuously
Make the fractal render constantly
----------------------------------------------*/

Math.radians = function(degrees){
  return degrees * Math.PI / 180;
};
Math.degrees = function(radians){
  return radians * 180 / Math.PI;
};

//var angle = Math.radians(22);
var fps = 30;
var canvas;
var canvasContext;
var stemThickness = 5;
var angleSlider;

window.onload = function(){
  canvas = document.getElementById('canvas');
  canvasContext = canvas.getContext('2d');
  setInterval(draw,1000/fps);
};

function draw() {
  angleSlider = parseFloat(document.getElementById('angleSlider').value);
  console.log(angleSlider);
  constructTree(canvas.height/5,stemThickness,angleSlider);
}

function constructTree(l, w, a){
  colorRect(0,0,canvas.width,canvas.height,'#333')
  canvasContext.translate(canvas.width/2,canvas.height);
  branch(l, w, a);

  //fix bug(stem is too thin, exactly half the size it is supposed to be)
  canvasContext.translate(canvas.width/2+w,canvas.height);    //draw a seperate branch 
  branch(l, w, a);
}

function branch(len, width, angle) {
  drawLine(0, 0, 0, -len, width, '#ddd');
  canvasContext.translate(0, -len);
  if (len > 3) {
    canvasContext.save();
    canvasContext.rotate(angle);
    branch(len * 0.75, width-0.75, angle);
    canvasContext.restore();
    canvasContext.save();
    canvasContext.rotate(-angle);
    branch(len * 0.75, width-0.75, angle);
    canvasContext.restore();
  }
}

function drawLine(fromX, fromY, toX, toY, lineThickness, drawColor){
  canvasContext.lineWidth = lineThickness;
  canvasContext.strokeStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.moveTo(fromX,fromY);
  canvasContext.lineTo(toX,toY);
  canvasContext.stroke();
}

function colorRect(leftX, topY, width, height, drawColor){
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);
}
