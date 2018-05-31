let x_vals = [];
let y_vals = [];

let a, b, c, d;

const learningRate = 0.15;
const optimizer = tf.train.adam(learningRate);

let deg_slider;
let poly_deg;

function setup() {
	createCanvas(600, 400);

	deg_slider = createSlider(10, 30, 10);
	deg_slider.position(10, 420);
	poly_deg = 0;

	a = tf.variable(tf.scalar(random(-1, 1)));
	b = tf.variable(tf.scalar(random(-1, 1)));
	c = tf.variable(tf.scalar(random(-1, 1)));
	d = tf.variable(tf.scalar(random(-1, 1)));
}

function loss(pred, labels) {
	return pred.sub(labels).square().mean();
}

function predict(x) {
	const xs = tf.tensor1d(x);
	let ys;
	// y = ax + b;
	if (poly_deg == 1) {
		ys = xs.mul(a).add(b);
	}
	// y = ax^2 + bx + c
	else if (poly_deg == 2) {
		ys = xs.square().mul(a)
			.add(xs.mul(b))
			.add(c)
	}
	// y = ax^3 + bx^2 + cx + d
	else if (poly_deg == 3) {
		ys = xs.pow(tf.scalar(3)).mul(a)
			.add(xs.square().mul(b))
			.add(xs.mul(c))
			.add(d)
	}

	return ys;
}

function mousePressed() {
	if (mouseX < 600 && mouseY < 400) {
		let x = map(mouseX, 0, width, -1, 1);
		let y = map(mouseY, 0, height, 1, -1);
		x_vals.push(x);
		y_vals.push(y);
	}
}

function draw() {
	background(0);
	strokeWeight(0.5);
	fill(200);
	// polynomial degree gets taken from slider value
	poly_deg = round(deg_slider.value() / 10);
	text('polynomial degree: ' + poly_deg, 20, 20);

	tf.tidy(() => {
		if (x_vals.length > 0) {
			const ys = tf.tensor1d(y_vals);
			optimizer.minimize(() => loss(predict(x_vals), ys));
		}
	});

	stroke(255);
	strokeWeight(8);
	for (let i = 0; i < x_vals.length; i++) {
		let px = map(x_vals[i], -1, 1, 0, width);
		let py = map(y_vals[i], -1, 1, height, 0);
		point(px, py);
	}

	const curveX = [];

	for (let x = -1; x < 1.01; x += 0.05) {
		curveX.push(x);
	}

	const ys = tf.tidy(() => predict(curveX));
	let curveY = ys.dataSync();
	ys.dispose();

	noFill();
	beginShape();
	for (let i = 0; i < curveX.length; i++) {
		let x = map(curveX[i], -1, 1, 0, width);
		let y = map(curveY[i], -1, 1, height, 0);
		vertex(x, y);
	}
	endShape();

	// let x1 = map(curveX[0], -1, 1, 0, width);
	// let x2 = map(curveX[1], -1, 1, 0, width);

	// let y1 = map(curveY[0], -1, 1, height, 0);
	// let y2 = map(curveY[1], -1, 1, height, 0);

	// line(x1, y1, x2, y2);
}