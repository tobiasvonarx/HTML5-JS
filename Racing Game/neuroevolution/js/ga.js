function log(logWord, gen, text, num) {console.log("%c["+logWord+" "+gen+"]:  \t"+"%c"+text+"\t"+"%c"+num,"font-weight: bold; color: #2f2f2f;","font-weight: lighter;","color: #029d0d")};
// Create the next generation
function nextGeneration() {
	if (debugLog) {
		// log highscores of previous generation
		log("Generation",generation, "highest fitness of generation", bestCurrentFitness);
		log("Generation",generation, "highest fitness overall      ", bestEverFitness);
		log('','','','');

		generation++;

		// introduce new generation of cars
		// log("Generation",generation, "cars selected into gene pool      ", nextGenerationCars.length);
	} else {
		generation++;
	}

	showEndScreen = false;
	// setup();

	// Generate a new set of cars
	cars = generate();

	foundNextGenCars = false;
	bestCurrentFitness = 0;

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