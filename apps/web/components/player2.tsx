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

    const myRef = useRef()

    useEffect(() => {
	myP5 = new p5(Sketch, myRef.current)
    }, [])
    
    


    const Sketch = (p) => {

	p.preload = () => {
		song = p.loadSound('/sounds/teaser.mp3')
	}

	p.setup = () => {
		p.createCanvas(500, 500)
		//p.angleMode(p.DEGREES)
		//p.imageMode(p.CENTER)
		//p.rectMode(p.CENTER)
		
		p.background(20)
		//p.size(500, 500)
		//fft = new FFT(0.3)

		//img.filter(p.BLUR, 3)

		//p.noLoop()
	}
    
	p.draw = () => {
		
		p.stroke(255)
		p.strokeWeight(5)
		p.translate(p.width/2, p.height/2)
		p.line(x1(t, p), y1(t, p), x2(t, p), y2(t, p))
		t++		

		//if(!song.isPlaying()) p.noLoop()
				
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
	return  p.cos(t / 10) * 100
}
const x2 = (t: number, p: p5) => {
	return p.sin(t / 10) * 200 + p.sin(t) * 2
}
const y2 = (t: number, p: p5) => {
	return  p.cos(t / 20) * 200 + p.cos(t / 12) * 20
}