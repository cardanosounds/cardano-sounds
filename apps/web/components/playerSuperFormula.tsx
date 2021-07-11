import React, { useEffect, useRef } from 'react'
import p5, { FFT, SoundFile, Vector } from 'p5'
import "../p5.sound.js"
import { Flex } from '@chakra-ui/react'

export default function PlayerSuperFormula({ isDark } : { isDark: boolean}) {
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

		//isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
		//p.background(bgColor.r, bgColor.g, bgColor.b)

		p.noFill()

		p.stroke(255)
		p.strokeWeight(2)


		p.textSize(p.width/5)	
		p.textFont(fa)

		fft = new FFT()
	

		//p.noLoop()
	}

	p.draw = () => {
		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 245, b: 245}
		p.background(bgColor.r, bgColor.g, bgColor.b)

		
		fft.analyze()
		amp = p.int(fft.getEnergy(20, 220))
		ampBass = p.int(fft.getEnergy("bass"))
		ampMid = p.int(fft.getEnergy("lowMid"))
		ampHigh = p.int(fft.getEnergy("mid"))
		

		p.beginShape()
		p.stroke(255)
		p.strokeWeight(3)
		for(let t = 0; t <= 2 * p.PI; t += 0.1) {
			let rad: number = r(t, p.mouseX / 100, 1, 0, 1, 1, 1, p);
			let x: number = rad * p.cos(t)
			let y: number = rad * p.sin(t)
			p.vertex(x, y)
			console.log(x)
			console.log(y)
		}

		p.endShape();


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

const r = (theta: number, a: number, b: number, 
	m: number, n1: number, n2: number, n3: number, p:p5) => {
	return p.pow(p.pow(p.abs(p.cos(m * theta / 4.0) / a), n2) 
		+ p.pow(p.abs(p.sin(m * theta / 4.0) / b), n3), -1.0 / n1)
}