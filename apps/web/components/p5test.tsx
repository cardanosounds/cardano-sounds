import React, { useEffect, useRef } from 'react'
// import p5, { FFT, Image, SoundFile, Vector } from 'p5'
// import "../p5.sound.js"


export default function Sounds() {
    // let myP5: p5
    // let song: SoundFile
    // let fft: FFT
    // let particles: Particle[] = []
    // let amp: number
    // let img: Image

    // const myRef = useRef()

    // useEffect(() => {
	// myP5 = new p5(Sketch, myRef.current)
    // }, [])
    
    // const Sketch = (p) => {

	// p.preload = () => {
	// 	song = p.loadSound('/sounds/teaser.mp3')
	// 	img = p.loadImage('/images/background1.png')
	// }

	// p.setup = () => {
	// 	p.createCanvas(p.windowWidth, p.windowHeight)
	// 	p.angleMode(p.DEGREES)
	// 	p.imageMode(p.CENTER)
	// 	p.rectMode(p.CENTER)
	// 	fft = new FFT(0.3)

	// 	img.filter(p.BLUR, 3)

	// 	p.noLoop()
	// }
    
	// p.draw = () => {
	// 	p.background(0)

	// 	p.translate(p.width / 2, p.height / 2)

	// 	fft.analyze()
	// 	amp = fft.getEnergy(20, 200)

	// 	p.push()
	// 	if(amp > 225) {
	// 		p.rotate(p.random(-0.5, 0.5))
	// 	}

	// 	p.image(img, 0, 0, p.width * 1.1 , p.height * 1.1)
	// 	p.pop()

	// 	let alpha = p.map(amp, 0, 255, 180, 150)
	// 	p.fill(0, alpha)
	// 	p.noStroke()
	// 	p.rect(0, 0, p.width, p.height)

	// 	p.stroke(255)
	// 	p.strokeWeight(3)
	// 	p.noFill()

		
	// 	let wave = fft.waveform()

	// 	for (let t = -1; t <= 1; t += 2) {
	// 		p.beginShape()
	// 		for(let i = 0; i <= 180; i += 0.5){
	// 			let index = p.floor(p.map(i, 0, 180, 0, wave.length - 1))

	// 			let r = p.map(wave[index], -1, 1, 150, 350)

	// 			let x = r * p.sin(i) * t
	// 			let y = r * p.cos(i)
	// 			p.vertex(x, y)

	// 		}
	// 		p.endShape()
	// 	}

	// 	let particle: Particle = new Particle(p)

	// 	particles.push(particle)
	// 	for(let i = particles.length - 1; i >= 0; i--) {
	// 		const prtcl = particles[i]

	// 		if(!prtcl.edges(p)){
	// 			prtcl.update(amp > 225)
	// 			prtcl.show(p)
	// 		} else{
	// 			particles.splice(i, 1)
	// 		}
	// 	}

	// 	if(!song.isPlaying()) particles = []
				
	// }

	// p.mouseClicked = () => {
	// 	if(song.isPlaying()) {
	// 		song.pause()
	// 		p.noLoop()
	// 	} else {
	// 		song.play()
	// 		p.loop()
	// 	}
	// }

    // }

    return (
        <>
		{/* <div ref={myRef}>

		</div> */}
        </>
    )
}

// class Particle {
// 	//position
// 	pos: Vector
// 	//velocity
// 	vel: Vector
// 	//acceleration
// 	acc: Vector
// 	//width of the particle
// 	w: number
// 	//particle color
// 	color: number[]

// 	constructor(p: p5){
// 		this.pos = Vector.random2D().mult(250)
// 		this.vel = p.createVector(0, 0)
// 		this.acc = this.pos.copy().mult(p.random(0.0001, 0.00001))
// 		this.color = [p.random(200, 255), p.random(200, 255), p.random(200, 255)]
// 		this.w = p.random(3, 5)
// 	}

// 	update(isAmpOverLim: boolean) {
// 		this.vel.add(this.acc)
// 		this.pos.add(this.vel)
// 		if(isAmpOverLim){
// 			this.pos.add(this.vel)
// 			this.pos.add(this.vel)
// 			this.pos.add(this.vel)

// 		}
// 	}

// 	edges(p: p5){
// 		if(this.pos.x < -p.width / 2 
// 			|| this.pos.x > p.width / 2
// 			|| this.pos.y < -p.height / 2
// 			|| this.pos.y > p.height / 2){
// 				return true
// 		} else {
// 			return false
// 		}
// 	}

// 	show(p: p5){
// 		p.noStroke()
// 		p.fill(this.color)
// 		p.ellipse(this.pos.x, this.pos.y, this.w)
// 	}



// }