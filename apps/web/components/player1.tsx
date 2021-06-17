import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector } from 'p5'
import "../p5.sound.js"


export default function PlayerOne({ size } : { size: { width: number, height: number}}) {
    let myP5: p5
    let song: SoundFile
    let fft: FFT
    let amp: number
    let img: Image
    let dt: Array<Dots>

    const myRef = useRef()

    useEffect(() => {
	myP5 = new p5(Sketch, myRef.current)
    }, [])
    
    const Sketch = (p) => {

	p.preload = () => {
		song = p.loadSound('/sounds/teaser.mp3')
	}

	p.setup = () => {
		p.createCanvas(size.width, size.height)
		p.angleMode(p.DEGREES)
		//p.imageMode(p.CENTER)
		//p.rectMode(p.CENTER)
		p.smooth();
		dt = [];
		for (let i=0;i<120;i++) {
			let pd: Vector = new Vector().set(p.random(-150, 150), p.random(-150, 150));
			let d: Dots = new Dots(p);
			dt.push(d)
		}
		fft = new FFT(0.3)

		//img.filter(p.BLUR, 3)

		p.noLoop()
	}
    
	p.draw = () => {
		p.background(0)

		p.translate(p.width / 2, p.height / 2)

		fft.analyze()
		amp = fft.getEnergy(20, 200)

		p.push()
		//if(amp > 225) {
			//p.rotate(p.random(-0.5, 0.5))
		//}

		//p.image(img, 0, 0, p.width * 1.1 , p.height * 1.1)
		p.pop()

		
		let wave = fft.waveform()

//		for (let t = -1; t <= 1; t += 2) {
//			p.beginShape()
//			for(let i = 0; i <= 180; i += 0.5){
//				let index = p.floor(p.map(i, 0, 180, 0, wave.length - 1))
//
//				let r = p.map(wave[index], -1, 1, 150, 350)
//
//				let x = r * p.sin(i) * t
//				let y = r * p.cos(i)
//				p.vertex(x, y)
//
	//		}
	//		p.endShape()
		//}

		
				
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

class Dots {
  location: Vector
  velocity: Vector
  c: p5.Color
  radius: number = 200;

  constructor(p: p5)//_pv: Vector, )
  {
   // this.location = _pv;
    const j: number = p.random(0, 5);
    if (j==0) this.c = p.color('#05CDE5');
    if (j==1) this.c = p.color('#FFB803');
    if (j==2) this.c = p.color('#FF035B');
    if (j==3) this.c = p.color('#3D3E3E');
    if (j==4) this.c = p.color('#D60FFF');
    const xt: number = p.random(-0.01, 0.01);
    const yt: number = p.random(-0.01, 0.01);
    this.velocity =  new Vector().set(xt, yt);
  }

  display(p: p5) {
    p.fill(this.c);
    p.noStroke();
    p.ellipse(this.location.x, this.location.y, 2, 2);
  }
  update(p: p5) {
    if (p.dist(this.location.x, this.location.y, 0, 0)> this.radius) {
      this.velocity.mult(-1);
      this.location.add(this.velocity);
    }
    else {
      this.location.add(this.velocity);
    }
  }
}
