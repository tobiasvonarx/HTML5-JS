//add math methods radians and degree for conversion
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

Math.degrees = function(radians) {
	return radians * 180 / Math.PI;
};

// adopted from github.com/processing/p5js
function randomGaussian(mean, sd) {
	var y1, x1, x2, w;
	if (previous) {
		y1 = y2;
		previous = false;
	} else {
		do {
			x1 = this.random(2) - 1;
			x2 = this.random(2) - 1;
			w = x1 * x1 + x2 * x2;
		} while (w >= 1);
		w = Math.sqrt(-2 * Math.log(w) / w);
		y1 = x1 * w;
		y2 = x2 * w;
		previous = true;
	}

	var m = mean || 0;
	var s = sd || 1;
	return y1 * s + m;
};