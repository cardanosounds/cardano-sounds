import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector, Color } from 'p5'
import "../p5.sound.js"
import { Flex } from '@chakra-ui/react'

export default function PlayerRandomDancers({ size, isDark } : { size: { width: number, height: number}, isDark: boolean}) {
let myP5: p5
let song: SoundFile
let fft: FFT
let wave
let amp: number
let ampBass: number
let sd: Vector
let prevd: Vector
let w: number
let bgColor: {r: number, g: number, b: number} = {r: 26, g: 32, b: 44}
let fa
let dancersArr: Array<Vector>
let prevDancersArr: Array<Vector>			
let bassDancersArr: Array<Vector>
let prevBassDancersArr: Array<Vector>

const myRef = useRef()

const updateW = (p: p5) => {
	if(p.windowWidth < 550){
		w = p.windowWidth * 0.9;
	} else {
		w = p.windowWidth * 0.4;
	}
}

useEffect(() => {
	myP5 = new p5(Sketch, myRef.current)
}, [])


const Sketch = (p) => {

	p.preload = () => {
		
		fa = p.loadFont('https://arweave.net/2sAqaLM2Dx4kl-4cDfjym2DOylAKi1F7vi-Gy1ndw9U');
		song = p.loadSound('https://5qivp3uhdkmad6mndrvlhcqd6s4eu7bizg47zkuhbe544z5f65lq.arweave.net/7BFX7ocamAH5jRxqs4oD9LhKfCjJufyqhwk7zmel91c')
		
	}

	p.setup = () => {
		updateW(p)
		p.createCanvas(w, w)
		p.textAlign(p.CENTER, p.CENTER);

		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
		p.background(bgColor.r, bgColor.g, bgColor.b)

		dancersArr = []
		prevDancersArr = []
		bassDancersArr = []
		prevBassDancersArr = []

		for(let i = 0; i < 8; i++) {
			const d = (i + 1) * 0.5
			const sd = p.createVector(p.width/d, p.height/2)
			const prevd = sd.copy()
			dancersArr.push(sd)
			prevDancersArr.push(prevd)
		}

		for(let i = 0; i < 17; i += 2) {
			const d = (i + 1) * 0.15
			const sd = p.createVector(p.width/2, p.height/d)
			const prevd = sd.copy()
			bassDancersArr.push(sd)
			prevBassDancersArr.push(prevd)
		}


		p.textSize(p.width/5)	
		p.textFont(fa)

		fft = new FFT()
		wave = fft.waveform()
	}

	p.draw = () => {
		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
		//.background(bgColor.r, bgColor.g, bgColor.b)

		bgColor = {r: 26, g: 32, b: 44} // bgColor = {r: 255, g: 245, b: 245}
		p.background(bgColor.r, bgColor.g, bgColor.b)

		
		fft.analyze()
		amp = p.int(fft.getEnergy(20, 220))
		ampBass = p.int(fft.getEnergy("bass"))

		if(amp == 0) {
			let playIconChar = p.char(61515)
			p.fill(255, 245, 245)
			p.text(playIconChar, p.width/2, p.height/2)
		} else {
			p.beginShape()
			p.noFill()	
			p.stroke(255, 245, 245)
			
			p.strokeWeight(3)
			
			const bassUp = ampBass > 234 ? true : false
			
			for(let i = 0; i < 8; i++)
			{
				let sd = dancersArr[i]
				let prevd = prevDancersArr[i]	
				let bassD = bassDancersArr[i]
				let prevBassD = prevBassDancersArr[i]		
				
				let step = p5.Vector.random2D()
				let bassStep = p5.Vector.random2D()

				const index = p.floor(p.map(i, 0, 7, 0, wave.length - 1))
				
				if(wave[index] != 0 ) {
					
					p.line(sd.x, sd.y, prevd.x, prevd.y)
					
					if(bassUp){
						step.mult(p.random(1, 10))
					} else {
						p.random(100) > 10 ? step.mult(1) : step.mult(10)

					}

					prevd.set(sd)
					prevDancersArr[i] = prevd
					sd.add(step)
					if(p.abs(sd.x) >= p.width || p.abs(sd.y) >= p.height){
						const d = (i + 1) * 0.5
						dancersArr[i] = p.createVector(p.width/d, p.height/2)
					}
					else {
						dancersArr[i] = sd
					}
				}
				if(bassUp){

					p.line(bassD.x, bassD.y, prevBassD.x, prevBassD.y)

					bassStep.mult(p.random(1, 25))
					
					prevBassD.set(bassD)
					prevBassDancersArr[i] = prevBassD
					bassD.add(bassStep)
					if(p.abs(bassD.x) >= p.width || p.abs(bassD.y) >= p.height){
						const d = (i + 1) * 2 * 0.15
						bassDancersArr[i] = p.createVector(p.width/2, p.height/d)
					}
					else {
						bassDancersArr[i] = bassD
					}
				}
			}
			p.endShape();
		}

				
	}
	p.mouseClicked = () => {
		if(song.isPlaying()) {
			song.pause()
			//p.noLoop();
			
		} else {
			song.loop()
			//p.loop();
						
		}
	}
	p.windowResized = () => {
		updateW(p)
		p.resizeCanvas(w, w)
	}
}

return (
	<Flex justify="center" align="center" w="100%">
		<Flex w={["90%", "90%", "40%"]} ref={myRef}>

		</Flex>
	</Flex>
)
}

