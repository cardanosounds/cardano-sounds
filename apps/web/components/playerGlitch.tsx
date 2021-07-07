import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector, Color } from 'p5'
import "../p5.sound.js"

export default function PlayerGlitch({ size, isDark } : { size: { width: number, height: number}, isDark: boolean}) {
let myP5: p5
let song: SoundFile
let fft: FFT
let amp: number
let t: number = 0
let bgColor: {r: number, g: number, b: number} = {r: 26, g: 32, b: 44}
let sampleIsLooping: boolean = false;
let fa

const myRef = useRef()

useEffect(() => {
	myP5 = new p5(Sketch, myRef.current)
}, [])


const Sketch = (p) => {

	p.preload = () => {
		
		fa = p.loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
		song = p.loadSound('https://5qivp3uhdkmad6mndrvlhcqd6s4eu7bizg47zkuhbe544z5f65lq.arweave.net/7BFX7ocamAH5jRxqs4oD9LhKfCjJufyqhwk7zmel91c')
		
	}

	p.setup = () => {
		p.createCanvas(size.width, size.height)
		p.textAlign(p.CENTER, p.CENTER);
		
		p.background(26, 32, 44)

		p.textSize(p.width/5)	
		p.textFont(fa)

		fft = new FFT()
	

		//p.noLoop()
	}

	p.draw = () => {
		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
		p.background(bgColor.r, bgColor.g, bgColor.b)
		p.strokeWeight(5)
		fft.analyze()
		amp = p.int(fft.getEnergy(20, 220))
		

		if(amp == 0) {
			let playIconChar = p.char(61515)
			p.fill(255)
			p.text(playIconChar, p.width/2, p.height/2)
		} else {
			//let playIconChar = p.char(61516)
			//p.fill(255)
			//p.text(playIconChar, p.width/2, p.height/2)

			let wave = fft.waveform()
			
			if(amp > 215) {
				let tN = p.map(amp, 0, 250, 1.2, 2)
				p.push()
				
				p.translate(p.width/tN, p.height/tN)
				for(let i = 0; i < 10; i++) {
					let index = p.floor(p.map(i, 0, 10, 0, wave.length - 1))
					let trebleColor: number= p.map(wave[index], -1, 1, 20, 255)
					// = p.map(amp, 0, 250, 20, 255)
					p.stroke(trebleColor, p.random(0,255), p.random(0, 255))
					p.line(x1(t + i, p), y1(t + i, p), x2(t + i, p), y2(t + i, p))
				}
				p.pop()
			}
			
			p.translate(p.width/2, p.height/2)
			
			for(let i = 0; i < 10; i++) {
				let index = p.floor(p.map(i, 0, 10, 0, wave.length - 1))

				let waveColor: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 20, 255)
				p.stroke(waveColor)
				p.line(x1(t + i, p), y1(t + i, p), x2(t + i, p), y2(t + i, p))
			}

			t+= p.map(amp, 0, 250, 0, 0.75)
		}

		//if(sampleIsLooping && song.loop)

				
	}
	p.mouseClicked = () => {
		if(song.isPlaying()) {
			song.pause();
			//p.noLoop();
			
		} else {
			song.loop();
			//p.loop();
						
		}
	}
}

return (
	<>
		<div ref={myRef}>

		</div>
	</>
)
}

const x1 = (t: number, p: p5) => {
	return p.sin(t / 10) * 100 + p.sin(t / 5) * 20
}
const y1 = (t: number, p: p5) => {
	return  p.cos(t / 10) * 100 + p.cos(t / 4) * 5
}
const x2 = (t: number, p: p5) => {
	return p.sin(t / 10) * 200 + p.sin(t) * 2
}
const y2 = (t: number, p: p5) => {
	return  p.cos(t / 20) * 200 + p.cos(t / 12) * 20
}