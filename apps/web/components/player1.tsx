import React, { useEffect, useRef } from 'react'
import p5, { FFT, Image, SoundFile, Vector, Color } from 'p5'
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
		p.smooth()
		dt = [];
		for (let i=0;i<120;i++) {
			let pd: Vector = new Vector().set(p.random(-150, 150), p.random(-150, 150))
			let d: Dots = new Dots(p, pd)
			dt.push(d)
		}
		fft = new FFT(0.3)

		//img.filter(p.BLUR, 3)

		p.noLoop()
	}
    
	p.draw = () => {
		p.background(255)
		p.translate(p.width/2, p.height/2)
		p.push()
		p.fill(0)
		p.stroke(0,50)
		p.ellipse(0,0,400,400)
		p.pop()
		//----------------
		for (let i=0;i< dt.length;i++) {
			let dots1: Dots = dt[i]
			dots1.display(p)
			dots1.update(p)
			for (let j=i+1;j<dt.length;j++) {
				let dots2: Dots = dt[j]
				dots2.update(p)
				if (p.dist(dots1.location.x, dots1.location.y, dots2.location.x, dots2.location.y)< p.distance) {
					for (let k=j+1;k<dt.length;k++) {
						let dots3: Dots = dt[k]
						dots3.update(p)
						if (p.flag) {
							p.fill(dots3.c, 50)
							p.noStroke()
						} else {
							p.noFill()
							p.stroke(255,50)
						}
						if (p.dist(dots3.location.x, dots3.location.y, dots2.location.x, dots2.location.y)<p.distance) {
							p.beginShape();
							p.vertex(dots3.location.x, dots3.location.y)
							p.vertex(dots2.location.x, dots2.location.y)
							p.vertex(dots1.location.x, dots1.location.y)
							p.endShape();
						}
					}
				}
			}
		}

		if(!song.isPlaying()) p.noLoop()
				
	}

	p.keyPressed = () => {
  		p.flag=!p.flag
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
  c: Color
  radius: number = 200;

  constructor(p: p5, _pv: Vector)
  {
    this.location = _pv;
    const j: number = p.int(p.random(0, 5));
    if (j==0) this.c = p.color(5, 205, 229)
    if (j==1) this.c = p.color(255, 184, 3);
    if (j==2) this.c = p.color(255, 3, 91);
    if (j==3) this.c = p.color(61, 62, 62);
    if (j==4) this.c = p.color(214, 15, 255);
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
