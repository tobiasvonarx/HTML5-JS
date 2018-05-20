// Create the next generation
function nextGeneration() {
	console.log('nextGeneration called');
	showEndScreen = false;
	// setup();

	// Generate a new set of cars
	cars = generate();

	foundNextGenCars = false;

}

// Generate a new population of cars
function generate() {
	const pic = blueCarPicIdle;

	let newcars = poolSelection();

	for (let i = 0; i < newcars.length; i++) {
		newcars[i].reset(firstPlayerStartTile, pic, pic, 'car');
	}

	return newcars;
}

// An algorithm for picking one car from an array
// based on score
function poolSelection() {
	let pool = [];
	let car;

	for (let i = 0; i < carCount; i++) {
		if (i % 5 == 0) {
			car = new carClass();
		} else {
			car = nextGenerationCars[Math.floor(Math.random() * nextGenerationCars.length)].copy();
		}
		pool.push(car);
	}
	return pool;
}