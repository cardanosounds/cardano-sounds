let song, fft, amp, ampBass, ampMid, ampHigh, fa
let t = 0
function preload() {
		
	fa = loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
	song = loadSound('https://5qivp3uhdkmad6mndrvlhcqd6s4eu7bizg47zkuhbe544z5f65lq.arweave.net/7BFX7ocamAH5jRxqs4oD9LhKfCjJufyqhwk7zmel91c')
}

function setup() {
	createCanvas(800, 800)
	textAlign(CENTER, CENTER);

	background(20)

	fft = new p5.FFT()


	noLoop()
}

function draw() {
	background(20);
	strokeWeight(5);
	fft.analyze();
	amp = int(fft.getEnergy(20, 220));
	ampBass = int(fft.getEnergy("bass"))
	ampMid = int(fft.getEnergy("lowMid"))
	ampHigh = int(fft.getEnergy("mid"))

	if(amp === 0 || typeof(amp) === "undefined") {
		let playIconChar = char(61515)
		fill(255)
		textSize(width/5)	
		textFont(fa)
		text(playIconChar, width/2, height/2)
	} else {
		let wave = fft.waveform()
		
		push()
		translate(width/2, height/2)
		
		for(let i = 0; i < 20; i++) {
			let index = floor(map(i, 0, 10, 0, wave.length - 1))
			//let red: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 20, 255)
			//let green: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 24)
			//green = p.map(green, 0, 24, 255, 0)
			//let blue: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 2, 36)
			//blue = p.map(blue, 2, 36, 0, 255)
			stroke(ampHigh, ampMid, ampBass)
			console.log(ampMid)
			line(x1(t + i), y1(t + i), x2(t + i), y2(t + i))
		}
		pop()
		if(ampBass > 230) {
			push()
			translate(width/2, height/2)
			let countB = map(ampBass, 200, 250, 1, 20)
			
			for(let i = 0; i < 20; i++) {
				let index = floor(map(i, 0, 10, 0, wave.length - 1))
				//let green: number = p.map(i, 0, 20, 0, 255)
				//let blue: number = p.map(i, 0, 20, 255, 0)
				let red = amp == 0 ? 20 : map(wave[index], -1, 1, 20, 255)
				let colMultiplier = map(wave[index], -1, 1, 1, 12)
				let green = amp == 0 ? 20 : map(wave[index], -1, 1, 0, 24)
				green = map(green, 0, 24, 0, 255)
				let blue = amp == 0 ? 20 : map(wave[index], -1, 1, 0, 36)
				blue = map(blue, 0, 36, 0, 255)
				stroke(ampBass, ampMid, ampHigh)
				//p.stroke(red, i * colMultiplier, i * colMultiplier)
				line(x1(-0.5*t + i), y1(-0.5*t + i), x2(-0.5*t + i), y2(-0.5*t + i))
			}
			pop()
		}

		if(ampMid > 200) {
			push()
			translate(width/2, height/2)
			let count = map(ampMid, 200, 250, 1, 20)
			
			for(let i = 0; i < 20; i++) {
				let index = floor(map(i, 0, 10, 0, wave.length - 1))
				//let green: number = p.map(i, 0, 20, 0, 255)
				//let blue: number = p.map(i, 0, 20, 255, 0)
				let red = amp == 0 ? 20 : map(wave[index], -1, 1, 20, 255)
				let colMultiplier = map(wave[index], -1, 1, 1, 12)
				let green = amp == 0 ? 20 : map(wave[index], -1, 1, 0, 24)
				green = map(green, 0, 24, 0, 255)
				let blue = amp == 0 ? 20 : map(wave[index], -1, 1, 0, 36)
				blue = map(blue, 0, 36, 0, 255)
				stroke(ampMid, ampBass, ampHigh)
				//p.stroke(red, i * colMultiplier, i * colMultiplier)
				line(x1(-t + i), y1(-t + i), x2(-t + i), y2(-t + i))
			}
			pop()
		}

		t+= map(amp === 0 ? 0 : amp, 0, 250, 0, 0.8)
	}

	//if(!song.isPlaying()) noLoop();
			
}

function mouseClicked() {
	if(song.isPlaying()) {
		song.pause();
		noLoop();
	} else {
		song.play();
		loop();
	}
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