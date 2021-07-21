import React, { useEffect, useRef } from 'react'
import p5, { FFT, SoundFile } from 'p5'
import "../p5.sound.js"
import { Flex } from '@chakra-ui/react'

export default function PlayerSuperFormula({ size, isDark } : { size: { width: number, height: number}, isDark: boolean}) {
let myP5: p5
let song: SoundFile
let fft: FFT
let amp: number
let ampBass: number
let ampMid: number
let ampHigh: number
let bgColor: {r: number, g: number, b: number} = {r: 26, g: 32, b: 44}
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
		const w = getW(p)
		p.createCanvas(w, w)
		p.textAlign(p.CENTER, p.CENTER);
	
		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
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
		isDark ? bgColor = {r: 26, g: 32, b: 44} : bgColor = {r: 255, g: 255, b: 255}
		p.background(bgColor.r, bgColor.g, bgColor.b)
	
		
		fft.analyze()
		amp = p.int(fft.getEnergy(20, 220))
		ampBass = p.int(fft.getEnergy("bass"))
		ampMid = p.int(fft.getEnergy("lowMid"))
		ampHigh = p.int(fft.getEnergy("mid"))
	
		if(amp == 0) {
			let playIconChar = p.char(61515)
			p.fill(255, 245, 245)
			p.text(playIconChar, p.width/2, p.height/2)
		} else {
			
			p.translate(p.width / 2, p.height / 2)
			p.beginShape()
			p.noFill()	
			p.stroke(255, 245, 245)
			
			p.strokeWeight(3)
			
			
			const isUp = ampBass > 235 ? true : false
			for(let t = 0; t <= 2*p.PI; t += 0.01) {
				const rad = r(
					t,	//theta
					100,//a
					100,	//b
					2,  //m
					p.map(ampMid, 0, 255, 0, 26),	//n1
					p.map(ampBass, 0, 255, 0, 16),		//n2
					p.map(amp, 0, 255, 0, 16), 	//n3
					p	//p5 lib
					);
				const x = rad * p.cos(t)
				const y = rad * p.sin(t)
				if(isUp){
					const x = (-rad) * p.cos(t)
					const y = (-rad) * p.sin(t)
					p.vertex(x, y)
				} 
			}
		
			p.endShape();
			
		}
						
	}
	p.mouseClicked = () => {
		if(song.isPlaying()) {
			song.pause()	
		} else {
			song.loop()
		}
	}
	p.windowResize = () => {
		const w = getW(p)
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


function getW(p: p5) {
	if(p.windowWidth < 600){		
		return p.windowWidth * 0.9;
	} else {
		return p.windowWidth * 0.5;
	}
}