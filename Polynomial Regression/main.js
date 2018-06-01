let x_vals = [];
let y_vals = [];

let a, b, c, d;

let w, h;
let coefficients;

let learningRate;
let lr_slider;
let optimizer;

let deg_slider;
let poly_deg;

function setup() {
	w = window.innerWidth-20;
	h = window.innerHeight-20;

	learningRate = 0.15;
	poly_deg = 0;

	createCanvas(w, h);

	setOptimizer();

	deg_slider = createSlider(10, 30, 10);
	deg_slider.position(20, 40);
	lr_slider = createSlider(0, 20, 3);
	lr_slider.position(160, 40);



	a = tf.variable(tf.scalar(random(-1, 1)));
	b = tf.variable(tf.scalar(random(-1, 1)));
	c = tf.variable(tf.scalar(random(-1, 1)));
	d = tf.variable(tf.scalar(random(-1, 1)));
}

function loss(pred, labels) {
	return pred.sub(labels).square().mean();
}

function setOptimizer() {
	optimizer = tf.train.adam(learningRate)
}

function predict(x) {
	const xs = tf.tensor1d(x);
	let ys = tf.scalar(0);

	coefficients = [a, b, c, d];

	for (let i = 0; i <= poly_deg; i++) {
		ys = ys.add(xs.pow(tf.scalar(i)).mul(coefficients[i]));
	}

	return ys;
}

function mousePressed() {
	if ((mouseX < w && mouseY < h) && (mouseX > 300 || mouseY > 60)) {
		let x = map(mouseX, 0, w, -1, 1);
		let y = map(mouseY, 0, h, 1, -1);
		x_vals.push(x);
		y_vals.push(y);
	}
}

function draw() {
	background(0);

	// polynomial degree gets taken from slider value
	poly_deg = round(deg_slider.value() / 10);

	// learning rate gets taken from slider value
	if (learningRate!=lr_slider.value()/20) {
		learningRate = lr_slider.value() / 20;
		setOptimizer();
	}
	
	// minimize the loss with the optimizer
	tf.tidy(() => {
		if (x_vals.length > 0) {
			const ys = tf.tensor1d(y_vals);
			optimizer.minimize(() => loss(predict(x_vals), ys));
		}
	});

	// draw the dots
	stroke('rgba(255, 255, 255, 0.25)');
	strokeWeight(8);
	for (let i = 0; i < x_vals.length; i++) {
		let px = map(x_vals[i], -1, 1, 0, w);
		let py = map(y_vals[i], -1, 1, h, 0);
		point(px, py);
	}

	// instantiate x-intervals of the curve
	const curveX = [];

	for (let x = -1; x < 1.01; x += 0.025) {
		curveX.push(x);
	}

	// get predictions for y-values of the curve
	const ys = tf.tidy(() => predict(curveX));
	let curveY = ys.dataSync();
	ys.dispose();

	// draw the curve
	noFill();
	stroke('rgba(255, 255, 255, 0.75)');
	beginShape();
	for (let i = 0; i < curveX.length; i++) {
		let x = map(curveX[i], -1, 1, 0, w);
		let y = map(curveY[i], -1, 1, h, 0);
		vertex(x, y);
	}
	endShape();

	// render the text
	strokeWeight(0.1);
	fill(200);
	text('polynomial degree: ' + poly_deg, 20, 20);
	text('learning rate: ' + learningRate, 160, 20);
}