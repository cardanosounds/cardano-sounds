import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector, Color } from 'p5'
import "../p5.sound.js"
import { Flex } from '@chakra-ui/react'

export default function PlayerRandomDancers({  isDark } : { isDark: boolean}) {
let myP5: p5
let song: SoundFile
let fft: FFT
let amp: number
let ampBass: number
let ampMid: number
let ampHigh: number
let sd: Vector
let prevd: Vector
let w: number
let bgColor: {r: number, g: number, b: number} = {r: 26, g: 32, b: 44}
let fa

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

		sd = p.createVector(p.width/2, p.height/2)
		prevd = sd.copy()


		p.textSize(p.width/5)	
		p.textFont(fa)

		fft = new FFT()
	

		//p.noLoop()
	}

	p.draw = () => {
		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
		//.background(bgColor.r, bgColor.g, bgColor.b)

		p.strokeWeight(5)
		p.stroke(255)
		

		fft.analyze()
		amp = p.int(fft.getEnergy(20, 220))
		ampBass = p.int(fft.getEnergy("bass"))
		ampMid = p.int(fft.getEnergy("lowMid"))
		ampHigh = p.int(fft.getEnergy("mid"))
		

		if(amp == 0) {
			//let playIconChar = p.char(61515)
			//p.fill(255)
			//p.text(playIconChar, p.width/2, p.height/2)
		} else {
			////let playIconChar = p.char(61516)
			//p.fill(255)
			//p.text(playIconChar, p.width/2, p.height/2)

			let wave = fft.waveform()
			
			
		}
		p.line(sd.x, sd.y, prevd.x, prevd.y)

		prevd.set(sd)
		//if(sampleIsLooping && song.loop)
		var step = Vector.random2D()
		p.random(100) > 5 ? step.mult(2) : step.mult(25)
		sd.add(step)

				
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

