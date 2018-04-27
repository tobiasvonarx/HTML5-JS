// Start the game over
// function resetGame() {
//   counter = 0;
//   // Resetting best car score to 0
//   if (bestcar) {
//     bestcar.score = 0;
//   }
//   pipes = [];
// }

// Create the next generation
function nextGeneration() {
	console.log('nextGeneration called');

	// setup();

	// var oldcars = allcars || cars;

	// Generate a new set of cars
	cars = generate(allCars);
	// Copy those cars to another array
	allCars = cars.slice();


}

// Generate a new population of cars
function generate(oldcars) {
	let newcars = [];
	var pic = blueCarPicIdle;

	for (let i = 0; i < oldcars.length; i++) {
		// Select a car based on score (fitness)
		let car = poolSelection(oldcars);
		car.reset(firstPlayerStartTile, pic, pic, 'car');
		newcars[i] = car;
	}


	return newcars;
}

// An algorithm for picking one car from an array
// based on score
function poolSelection(cars) {
	var index;

	for (var i = 0; i < cars.length; i++) {
		// console.log(cars[i].score);
		if (cars[i].score == -1) {
			// console.log(cars[i]);
			index = i;
		}
	}
	// console.log(topCar, topCarScore);

	// Make sure it's a copy!
	// (this includes mutation)
	return cars[index].copy();
}