let song, fft, amp, ampBass, ampMid, ampHigh, fa
let t = 0


function preload() {
	
	fa = loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
	song = loadSound('SOUND_ARWEAVE_LINK')
	
}

function setup() {
	const w = getW();
	var myCanv = createCanvas(w, w);
	myCanv.parent("sketchElement");
	textAlign(CENTER, CENTER);
	
	background(RGB_BACKGROUND_COLOR)

	textSize(width/5)	
	textFont(fa)

	fft = new p5.FFT()
}
function draw() {
	background(RGB_BACKGROUND_COLOR)
	strokeWeight(5)
	fft.analyze()
	amp = int(fft.getEnergy(20, 220))	

	if(amp == 0) {
		let playIconChar = char(61515)
		fill(RGB_FILL_COLOR)
		text(playIconChar, width/2, height/2)
	} else {
		
		let wave = fft.waveform()
		
		if(amp > 215) {
			let tN = map(amp, 0, 250, 1.2, 2)
			push()
			
			translate(width/tN, height/tN)
			for(let i = 0; i < 10; i++) {
				let index = floor(map(i, 0, 10, 0, wave.length - 1))
				let trebleColor = map(wave[index], -1, 1, 20, 255)
				stroke(trebleColor, random(0,255), random(0, 255))
				line(x1(t + i), y1(t + i), x2(t + i), y2(t + i))
			}
			pop()
		}
		
		translate(width/2, height/2)
		
		for(let i = 0; i < 10; i++) {
			let index = floor(map(i, 0, 10, 0, wave.length - 1))

			let waveColor  = amp == 0 ? 20 : map(wave[index], -1, 1, 20, 255)
			stroke(waveColor)
			line(x1(t + i), y1(t + i), x2(t + i), y2(t + i))
		}

		t+= map(amp, 0, 250, 0, 0.75)
	}
}
function mouseClicked(){
	if(windowWidth > 600){song.isPlaying()?song.pause():song.loop()}
}
function touchStarted(){
	if(windowWidth < 600){song.isPlaying()?song.pause():song.loop()}
}


// function touchStarted() {
// 	if(song.isPlaying()) {
// 		song.pause()	
// 	} else {
// 		song.loop()
// 	}
// }
// function mouseClicked() {
// 	if(song.isPlaying()) {
// 		song.pause();
// 		//noLoop();
		
// 	} else {
// 		song.loop();
// 		//loop();
					
// 	}
// }
function windowResized() {
	
	const w = getW();
	resizeCanvas(w, w);
}


function x1 (t) {
	return sin(t / 10) * 100 + sin(t / 5) * 20;
}
function y1 (t) {
	return  cos(t / 10) * 100 + cos(t / 4) * 5;
}
function x2 (t) {
	return sin(t / 10) * 200 + sin(t) * 2;
}
function y2 (t) {
	return  cos(t / 20) * 200 + cos(t / 12) * 20;
}

function getW() {
	if(windowWidth < 600){
		return windowWidth * 0.9;
	} else {
		return windowWidth * 0.4;
	}
}