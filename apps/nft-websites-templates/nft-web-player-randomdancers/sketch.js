let song, fft, amp, ampBass, fa, wave, dancersArr, prevDancersArr, bassDancersArr, prevBassDancersArr
let t = 0


function preload() {
		
	fa = loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
	song = loadSound('SOUND_ARWEAVE_LINK')
	
}

function setup(){
	const w = getW()
	createCanvas(w, w)
	textAlign(CENTER, CENTER)

	dancersArr = []
	prevDancersArr = []
	bassDancersArr = []
	prevBassDancersArr = []

	for(let i = 0; i < 8; i++) {
		const d = (i + 1) * 0.5
		const sd = createVector(width/d, height/2)
		const prevd = sd.copy()
		dancersArr.push(sd)
		prevDancersArr.push(prevd)
	}

	for(let i = 0; i < 17; i += 2) {
		const d = (i + 1) * 0.15
		const sd = createVector(width/2, height/d)
		const prevd = sd.copy()
		bassDancersArr.push(sd)
		prevBassDancersArr.push(prevd)
	}

	noFill()

	stroke(255)
	strokeWeight(2)
	textSize(width/5)	
	textFont(fa)
	
	fft = new p5.FFT()
	
	wave = fft.waveform()
}

function draw() {
	background(RGB_BACKGROUND_COLOR)

	fft.analyze()
	amp = int(fft.getEnergy(20, 220))
	ampBass = int(fft.getEnergy("bass"))

	if(amp == 0) {
		let playIconChar = char(61515)
		fill(RGB_FILL_COLOR)
		text(playIconChar, width/2, height/2)
	} else {

		beginShape()
		noFill()	
		stroke(RGB_FILL_COLOR)
		
		strokeWeight(3)
		
		const bassUp = ampBass > 234 ? true : false
		
		for(let i = 0; i < 8; i++)
		{
			let sd = dancersArr[i]
			let prevd = prevDancersArr[i]	
			let bassD = bassDancersArr[i]
			let prevBassD = prevBassDancersArr[i]		
			
			let step = p5.Vector.random2D()
			let bassStep = p5.Vector.random2D()

			const index = floor(map(i, 0, 7, 0, wave.length - 1))
			
			if(wave[index] != 0 ) {
				
				line(sd.x, sd.y, prevd.x, prevd.y)
				
				if(bassUp){
					step.mult(random(1, 10))
				} else {
					random(100) > 10 ? step.mult(1) : step.mult(10)
				}

				prevd.set(sd)
				prevDancersArr[i] = prevd
				sd.add(step)
				if(abs(sd.x) >= width || abs(sd.y) >= height){
					const d = (i + 1) * 0.5
					dancersArr[i] = createVector(width/d, height/2)
				}
				else {
					dancersArr[i] = sd
				}
			}
			if(bassUp){

				line(bassD.x, bassD.y, prevBassD.x, prevBassD.y)

				bassStep.mult(random(1, 25))
				
				prevBassD.set(bassD)
				prevBassDancersArr[i] = prevBassD
				bassD.add(bassStep)
				if(abs(bassD.x) >= width || abs(bassD.y) >= height){
					const d = (i + 1) * 2 * 0.15
					bassDancersArr[i] = createVector(width/2, height/d)
				}
				else {
					bassDancersArr[i] = bassD
				}
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

function getW() {
	if(windowWidth < 600){		
		return windowWidth * 0.9;
	} else {
		return windowWidth * 0.4;
	}
}