import React, { useEffect, useRef } from 'react'
// import p5 from 'p5'


export default function TestIcons() {
//     let myP5: p5
//     var font,
//   fontsize = 32

//     const myRef = useRef()

//     useEffect(() => {
// 	myP5 = new p5(Sketch, myRef.current)
//     }, [])
    
//     const Sketch = (p) => {

// 	p.preload = () => {
// 		p.textFont("FontAwesome"); 
		
// 	}

// 	p.setup = () => {

// 		p.createCanvas(400, 400);
// 		p.textAlign(p.CENTER, p.CENTER);

// 	}
    
// 	p.draw = () => {
// 		p.background(220);

	      
// 		var offsets = [-2, -1, 1, 2]; // used to create drop shadow effect
// 		for (var i = 0; i < 600; i++) {
// 			p.textSize(p.random(30, 50));
// 			p.push();
// 			p.translate(p.random(p.width), p.random(p.height));
// 			var icon = p.char(p.random(61440, 62000)); // Font Awesome fonts start at Hex F000
// 								// they end at...erm, I don't know.
// 			p.rotate(p.random(p.TWO_PI));
// 			p.fill(0);
// 			p.text(icon,0,0); // display the shadow first
// 			p.fill( p.color( p.random(360), p.random(80, 100), p.random(80, 100) ));
// 			p.text(icon, p.random(offsets), p.random(offsets)); // then coloured icon
// 			p.pop();
// 		}
		
				
// 	}

//     }

    return (
        <>
		{/* <div ref={myRef}>

		</div> */}
        </>
    )
}