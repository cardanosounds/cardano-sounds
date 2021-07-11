import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector, Color } from 'p5'
import "../p5.sound.js"


export default function PlayerColors({ size } : { size: { width: number, height: number}}) {
    let myP5: p5
    let song: SoundFile
    let fft: FFT
    let amp: number
    let ampBass: number
    let ampMid: number
    let ampHigh: number
    let img: Image
    let t: number = 0
    let fa

    const myRef = useRef()

    useEffect(() => {
	myP5 = new p5(Sketch, myRef.current)
    }, [])
    
    


    const Sketch = (p) => {

	p.preload = () => {
		
		fa = p.loadFont('/fontawesome.ttf');
		song = p.loadSound('/sounds/clip1.flac')
	}

	p.setup = () => {
		p.createCanvas(800, 800)
		p.textAlign(p.CENTER, p.CENTER);

		p.background(20)

		fft = new FFT()
	

		p.noLoop()
	}
    
	p.draw = () => {
		p.background(20)
		p.strokeWeight(5)
		fft.analyze()
		amp = p.int(fft.getEnergy(20, 220))
		ampBass = p.int(fft.getEnergy("bass"))
		ampMid = p.int(fft.getEnergy("lowMid"))
		ampHigh = p.int(fft.getEnergy("mid"))
		

		if(amp === 0 || typeof(amp) === "undefined") {
			let playIconChar = p.char(61515)
			p.fill(255)
			p.textSize(p.width/5)	
			p.textFont(fa)
			p.text(playIconChar, p.width/2, p.height/2)
		} else {

			let wave = fft.waveform()
			
			p.push()
			p.translate(p.width/2, p.height/2)
			
			for(let i = 0; i < 20; i++) {
				let index = p.floor(p.map(i, 0, 10, 0, wave.length - 1))
				//let red: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 20, 255)
				//let green: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 24)
				//green = p.map(green, 0, 24, 255, 0)
				//let blue: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 2, 36)
				//blue = p.map(blue, 2, 36, 0, 255)
				p.stroke(ampHigh, ampMid, ampBass)
				//console.log(ampMid)
				p.line(x1(t + i, p, amp), y1(t + i, p, amp), x2(t + i, p, amp), y2(t + i, p, amp))
			}
			p.pop()
			if(ampBass > 230) {
				p.push()
				p.translate(p.width/2, p.height/2)
				let countB = p.map(ampBass, 200, 250, 1, 20)
				
				for(let i = 0; i < 20; i++) {
					let index = p.floor(p.map(i, 0, 10, 0, wave.length - 1))
					//let green: number = p.map(i, 0, 20, 0, 255)
					//let blue: number = p.map(i, 0, 20, 255, 0)
					let red: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 20, 255)
					let colMultiplier: number = p.map(wave[index], -1, 1, 1, 12)
					let green: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 24)
					green = p.map(green, 0, 24, 0, 255)
					let blue: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 36)
					blue = p.map(blue, 0, 36, 0, 255)
					p.stroke(ampBass, ampMid, ampHigh)
					//p.stroke(red, i * colMultiplier, i * colMultiplier)
					p.line(x1(-0.5*t + i, p, amp), y1(-0.5*t + i, p, amp), x2(-0.5*t + i, p, amp), y2(-0.5*t + i, p, amp))
				}
				p.pop()
			}

			if(ampMid > 200) {
				p.push()
				p.translate(p.width/2, p.height/2)
				let count = p.map(ampMid, 200, 250, 1, 20)
				
				for(let i = 0; i < 20; i++) {
					let index = p.floor(p.map(i, 0, 10, 0, wave.length - 1))
					//let green: number = p.map(i, 0, 20, 0, 255)
					//let blue: number = p.map(i, 0, 20, 255, 0)
					let red: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 20, 255)
					let colMultiplier: number = p.map(wave[index], -1, 1, 1, 12)
					let green: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 24)
					green = p.map(green, 0, 24, 0, 255)
					let blue: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 36)
					blue = p.map(blue, 0, 36, 0, 255)
					p.stroke(ampMid, ampBass, ampHigh)
					//p.stroke(red, i * colMultiplier, i * colMultiplier)
					p.line(x1(-t + i, p, amp), y1(-t + i, p, amp), x2(-t + i, p, amp), y2(-t + i, p, amp))
				}
				p.pop()
			}

			t+= p.map(amp === 0 ? 0 : amp, 0, 250, 0, 0.8)
		}
				
	}

	p.mouseClicked = () => {
		if(song.isPlaying()) {
			song.pause()
			amp = 0 
			p.noLoop()
		} else {
			song.play()
			p.loop()
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

const x1 = (t: number, p: p5, a: number) => {
	return p.sin(t / 10) * 50 + p.sin(t / 5) * 20
}
const y1 = (t: number, p: p5, a: number) => {
	return  p.cos(t /10) * 50 + p.cos(t / 4) * 5
}
const x2 = (t: number, p: p5, a: number) => {
	return p.sin(t / 10) * 100 + p.sin(t) * 2
}
const y2 = (t: number, p: p5, a: number) => {
	return  p.cos(t / 20) * 100 + p.cos(t / 12) * 20
}