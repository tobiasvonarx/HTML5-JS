let song;
let fftMic, fftSong;
let toggleButton, replayButton;
let mic;
let timer, time;

function toggleSong() {
	if (song.isPlaying()) {
		song.pause();
	} else {
		song.play();
	}
}

function stopSong() {
	song.stop();

	// set time back to zero
	time = parseTime(0);
}

function preload() {
	song = loadSound(path);
}

function noMic() {
	console.error('no input device (microphone) found');
}

function keyPressed() {
	if (keyCode === 32) { // space key
		toggleSong();
	}
}

function setup() {
	createCanvas(512, 512);
	colorMode(HSB);
	noStroke();

	// initialize elements in the dom
	createDiv();
	toggleButton = createButton('pause/resume');
	toggleButton.mousePressed(toggleSong);
	replayButton = createButton('stop');
	replayButton.mousePressed(stopSong);
	timer = createP()

	// Create an audio input
	mic = new p5.AudioIn(noMic);

	// start the audio input.
	mic.start();

	// start the audio playback
	song.play();

	// initialize fourier transform algorithm for the two input sources
	fftMic = new p5.FFT(0.9, 128);
	fftMic.setInput(mic);

	fftSong = new p5.FFT(0.9, 128);
	fftSong.setInput(song);
}

// helper function used to format the time as a string with the format hh:ss
function parseTime(seconds) {
	let sec = Math.floor(seconds);
	let m = nf(floor(sec / 60), 2);
	let s = nf(sec % 60, 2);
	let t = m + ':' + s;
	return t;
}

function draw() {
	background(0);

	// freeze time if paused
	if (song.isPlaying()) {
		time = parseTime(song.currentTime()) + ' / ' + parseTime(song.duration());
	}

	// render in the dom
	timer.html(time);

	// run fft on the two spectra
	let spectrumSong = fftSong.analyze();
	let spectrumMic = fftMic.analyze();

	// draw customized graphs for each spectra
	for (let i = 0; i < spectrumSong.length; i++) {
		noStroke();
		fill(i, 255, 255);
		let x = map(i, 0, spectrumSong.length, 0, width);
		let h = -height + map(spectrumSong[i], 0, 255, height, 0);
		rect(x, height, width / spectrumSong.length, h);
	}

	for (let i = 0; i < spectrumMic.length; i++) {
		fill('rgba(255, 255, 255, 0.9)');
		let x = map(i, 0, spectrumMic.length, 0, width);
		let h = -height + map(spectrumMic[i], 0, 255, height, 0);
		rect(x, height, width / spectrumMic.length, h);
	}
}