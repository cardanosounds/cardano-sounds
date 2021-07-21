let song, fft, amp, ampBass, ampMid, ampHigh, fa, wave
let t = 0


function preload() {
		
	fa = loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
	song = loadSound('https://5qivp3uhdkmad6mndrvlhcqd6s4eu7bizg47zkuhbe544z5f65lq.arweave.net/7BFX7ocamAH5jRxqs4oD9LhKfCjJufyqhwk7zmel91c')
	
}

function setup(){
	const w = getW()
	createCanvas(w, w)
	textAlign(CENTER, CENTER);

	//isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
	//p.background(bgColor.r, bgColor.g, bgColor.b)

	noFill()

	stroke(255)
	strokeWeight(2)
	textSize(width/5)	
	textFont(fa)
	
	fft = new p5.FFT()
	
	wave = fft.waveform()

	//p.noLoop()
}

function draw() {
	bgColor = {r: 26, g: 32, b: 44} // bgColor = {r: 255, g: 245, b: 245}
	background(bgColor.r, bgColor.g, bgColor.b)

	
	fft.analyze()
	amp = int(fft.getEnergy(20, 220))
	ampBass = int(fft.getEnergy("bass"))
	ampMid = int(fft.getEnergy("lowMid"))
	ampHigh = int(fft.getEnergy("mid"))

	if(amp == 0) {
		let playIconChar = char(61515)
		fill(255, 245, 245)
		text(playIconChar, width/2, height/2)
	} else {
		
		translate(width / 2, height / 2)
		beginShape()
		noFill()	
		stroke(255, 245, 245)
		
		strokeWeight(3)
		
		
		const isUp = ampBass > 235 ? true : false
		for(let t = 0; t <= 2*PI; t += 0.01) {
			let index = floor(map(t, 0.00, 2*PI, 0, wave.length - 1))
			const rad = r(
				t,	//theta
				100,//a
				100,	//b
				6,//map(amp, 100,250, 0, 20),	//m
				map(ampMid, 0, 255, 0, 26),	//n1
				map(ampBass, 0, 255, 0, 16),		//n2
				map(amp, 0, 255, 0, 16)	//n3
				);
			const e = map(wave[index], -1, 1, 0, 2)
			const x = (rad + e) * cos(t)
			const y = (rad + e) * sin(t)
			//console.log(rad)
			vertex(x, y)
			if(isUp){
				const x = (-rad) * cos(t)
				const y = (-rad) * sin(t)
				vertex(x, y)
			} 
		}
	
		endShape();
		
	}
					
}
function mouseClicked() {
	if(song.isPlaying()) {
		song.pause()	
	} else {
		song.loop()
	}
}
function windowResize() {
	const w = getW()
	resizeCanvas(w, w)
}

function r (theta, a, b, m, n1, n2, n3) {
	return pow(pow(abs(cos(m * theta / 4.0) / a), n2) 
		+ pow(abs(sin(m * theta / 4.0) / b), n3), -1.0 / n1)
}

function getW() {
	if(windowWidth < 600){		
		return windowWidth * 0.9;
	} else {
		return windowWidth * 0.5;
	}
}