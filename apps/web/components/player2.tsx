import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector, Color } from 'p5'
import "../p5.sound.js"


export default function PlayerTwo({ size } : { size: { width: number, height: number}}) {
    let myP5: p5
    let song: SoundFile
    let fft: FFT
    let amp: number
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
		song = p.loadSound('/sounds/teaser.mp3')
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
		

		if(amp == 0) {
			let playIconChar = p.char(61515)
			p.fill(255)
			p.textSize(p.width/5)	
			p.textFont(fa)
			p.text(playIconChar, p.width/2, p.height/2)
		} else {

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

				let red: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 20, 255)
				let green: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 0, 24)
				green = p.map(green, 0, 24, 255, 0)
				let blue: number = amp == 0 ? 20 : p.map(wave[index], -1, 1, 2, 36)
				blue = p.map(blue, 2, 36, 0, 255)
				p.stroke(red, green, blue)
				p.line(x1(t + i, p), y1(t + i, p), x2(t + i, p), y2(t + i, p))
			}

			t+= p.map(amp, 0, 250, 0, 1)
		}


		if(!song.isPlaying()) p.noLoop()
				
	}

	p.mouseClicked = () => {
		if(song.isPlaying()) {
			song.pause()
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