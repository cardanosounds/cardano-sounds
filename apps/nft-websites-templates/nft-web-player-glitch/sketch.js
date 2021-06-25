let song, fft, amp, ampBass, ampMid, ampHigh, fa, w
let t = 0


function preload() {
	
	fa = loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
	song = loadSound('https://arweave.net/UWc0alxktDF6x_lZi_Maqe4ruy3x9StebFIaADhtmMY')
	
}

function setup() {
	updateW(windowWidth);
	var myCanv = createCanvas(w, w);
	myCanv.parent("sketchElement");
	textAlign(CENTER, CENTER);
	
	background(26, 32, 44)

	textSize(width/5)	
	textFont(fa)

	fft = new p5.FFT()
}
function draw() {
	bgColor = {r: 26, g: 32, b: 44} 
	background(bgColor.r, bgColor.g, bgColor.b)
	strokeWeight(5)
	fft.analyze()
	amp = int(fft.getEnergy(20, 220))	

	if(amp == 0) {
		let playIconChar = char(61515)
		fill(255)
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
				// = map(amp, 0, 250, 20, 255)
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
function mouseClicked() {
	if(song.isPlaying()) {
		song.pause();
		//noLoop();
		
	} else {
		song.loop();
		//loop();
					
	}
}
function windowResized() {
	
	updateW(windowWidth);
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

function updateW(wW) {
	if(wW < 600){
		console.log("make Big")
		console.log(windowWidth)
		
		w = wW * 0.9;
	} else {
		w = wW * 0.5;
	}
}