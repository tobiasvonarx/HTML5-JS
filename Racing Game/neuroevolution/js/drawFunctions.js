function drawPicWithRotation(img, x, y, angle){
	canvasContext.save();																	//save
	canvasContext.translate(x, y);															//https://www.udemy.com/how-to-program-games/learn/v4/t/lecture/3440548?start=60
	canvasContext.rotate(angle);
	canvasContext.drawImage(img, -img.width/2, -img.height/2);
	canvasContext.restore();
}

function colorRect(leftX, topY, width, height, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor){
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath(); 												//prepare for filling
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true); 		//create arc
	canvasContext.fill();	 												//no .arcfill so this fill method
}

function drawText(text, X, Y, alignment, drawColor, font='10px sans-serif'){
	canvasContext.font = font;
	canvasContext.fillStyle = drawColor;
	canvasContext.textAlign = alignment;
	canvasContext.fillText(text, X, Y);
}