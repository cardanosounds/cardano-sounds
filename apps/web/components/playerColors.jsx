import React, { useEffect, useRef } from 'react'
import p5, {FFT} from 'p5'

import "../p5.sound.js"

// } //{ size//{ width//number, height//number}, isDark//boolean}
export default function PlayerColors() {
    let myP5//p5
    let song//SoundFile
    let fft//FFT
    let amp//number
    let ampBass//number
    let ampMid//number
    let ampHigh//number
    let t//number = 0
    let bgColor//{r//number, g//number, b//number} = {r//26, g//32, b//44}
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
	
		// isDark ? bgColor = {r:26, g:32, b:44} : bgColor = {r:255, g:255, b:255}
		bgColor = {r:26, g:32, b:44} 
		p.noFill()
	
		p.stroke(255)
		p.strokeWeight(3)
	
	
		p.textSize(p.width/5)	
		p.textFont(fa)
	
		fft = new FFT()
	
	
		//p.noLoop()
	}
    
	p.draw = () => {
		// {r:26, g:32, b:44} : bgColor = {r:255, g:255, b:255}
		let bgColor = {r:26, g:32, b:44} // bgColor = {r//255, g//245, b//245}
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
			p.translate(p.width/2, p.height/2)
			
			for(let i = 0; i < 10; i++) {
				p.stroke(ampHigh, ampMid, ampBass)
				p.line(x1(t + i, p, amp), y1(t + i, p, amp), x2(t + i, p, amp), y2(t + i, p, amp))

				if(ampBass > 215) {
					p.stroke(ampBass, ampMid, ampHigh)
					p.line(x1(-0.5*t + i, p, amp), y1(-0.5*t + i, p, amp), x2(-0.5*t + i, p, amp), y2(-0.5*t + i, p, amp))
				}
				if(ampMid > 155){
					p.stroke(ampMid, ampBass, ampHigh)
					p.line(x1(-t + i, p, amp), y1(-t + i, p, amp), x2(-t + i, p, amp), y2(-t + i, p, amp))
				}
			}
			
			t+= p.map(amp, 0, 250, 0, 0.05)
			
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
        <>
		{/* <div ref={myRef}>

		</div> */}
        </>
    )
}

const x1 = (t) => {//number, p//p5, a//number) 
	return p.sin(t / 10) + p.sin(t / 5) * a
}
const y1 = (t) => {//number, p//p5, a//number)
	return  p.cos(t /10) + p.cos(t / 4) * a
}
const x2 = (t) => {//number, p//p5, a//number)x
	return p.sin(t / 10) + p.sin(t) * a
}
const y2 = (t) => {//number, p//p5, a//number)
	return  p.cos(t / 20) + p.cos(t / 12) * a
}



const getW = (p) => { //p5) => {
	if(p.windowWidth < 600){		
		return p.windowWidth * 0.9;
	} else {
		return p.windowWidth * 0.5;
	}
}