import React, { useEffect, useRef, useState } from 'react'
import p5 from 'p5'
import "../p5.sound.js"
import "../p5.dom.js"
import { Flex, Button } from '@chakra-ui/react'
import MintBtn from './MintBtn.jsx'
import useIpfs from "./mint/useIpfs";

let ipfs;
 
export default function P5sequencer() {
	const myRef = useRef()
	const initIpfs = useIpfs()
	const [soundfile, setSoundfile] = useState(null)
	const [ipfsHash, setIpfsHash] = useState(null)
	const [canMint, setCanMint] = useState(false)
    let myP5;

	var sloop;
	var bpm = 140; // 140 beats per minute
	var synth;
	var numTimeSteps = 16;
	var timeStepCounter = 0;
	var pitches = [57,60,62,64,67,69,72,74,76,79,81,84]; // A minor pentatonic scale
	var cells = [];
	var cellWidth, cellHeight;
	var controlPanelHeight;
	var playPauseButton;
	var tempoSlider;
	var tempoText;
	var clearButton;

    useEffect(() => {
		myP5 = new p5(Sketch, myRef.current)
		return () => {if(sloop) sloop.stop()}
    }, [])
    
    const Sketch = (p) => {

	 	p.setup = () => {
			p.createCanvas(p.windowWidth, p.windowHeight*0.7);
			controlPanelHeight = p.height / pitches.length;
			p.frameRate(10);

			// Prepare cells
			cellWidth = p.width / numTimeSteps;
			cellHeight = (p.height - controlPanelHeight) / pitches.length;
			for (var i=0; i<numTimeSteps; i++) {
				for (var j=0; j<pitches.length; j++) {
				var x = i*cellWidth;
				var y = controlPanelHeight + j*cellHeight;
				var pitch = pitches[pitches.length - j - 1]; // Pitches go from bottom to top
				cells.push(
					new Cell(p.createVector(x, y), pitch)
				);
				}
			}
			
			// UI
			// Create a synth to make sound with
			synth = new p5.PolySynth();
			
			// Create SoundLoop with 8th-note-long loop interval
			sloop = new p5.SoundLoop(soundLoop, "8n");
			sloop.bpm = bpm;
			playPauseButton = p.createButton('Record 10 sec');
			playPauseButton.mousePressed(togglePlayPause);
			playPauseButton.position(0, p.height*0.25);
			playPauseButton.size(p.width/4, controlPanelHeight);

			tempoSlider = p.createSlider(30, 300, bpm);
			tempoSlider.position(p.width/4, p.height*0.25);
			tempoSlider.size(p.width/4, controlPanelHeight);
			tempoText = p.createP("BPM: " + bpm);
			tempoText.position(p.width/2, p.height*0.27);
			tempoText.size(p.width/4, controlPanelHeight);
			
			clearButton = p.createButton('CLEAR ALL');
			clearButton.mousePressed(clearAll);
			clearButton.position(p.width*3/4, p.height*0.25);
			clearButton.size(p.width/4, controlPanelHeight);
		}

		p.draw = () => {
			// p.background(255);
			for (var i=0; i<cells.length; i++) {
				cells[i].checkIfHovered(p);
				cells[i].display(p);
			}
			bpm = tempoSlider.value();
			tempoText.html("BPM: " + bpm);
		}

		p.mouseClicked = () => {
			
			
			p.getAudioContext().resume();
			for (var i=0; i<cells.length; i++) {
				if (cells[i].hovered) {
					cells[i].enabled = !cells[i].enabled;
				}
			}
		}

		function soundLoop(cycleStartTime) {
			for (var i=0; i<cells.length; i++) {
			  if (p.floor(i / pitches.length) == timeStepCounter) {
				cells[i].active = true;
				if (cells[i].enabled) {
				  // Play sound
				  var velocity = 1; // Between 0-1
				  var quaverSeconds = this._convertNotation('8n'); // 8th note = quaver duration
				  var freq = p.midiToFreq(cells[i].pitch);
				  synth.play(freq, velocity, cycleStartTime, quaverSeconds);
				}
			  } else {
				cells[i].active = false;
			  }
			}
			this.bpm = bpm;
			timeStepCounter = (timeStepCounter + 1) % numTimeSteps;
		  }
	}

	function togglePlayPause() {
		if (sloop.isPlaying) {
			// sloop.pause();
		} else {
			console.log("play start")
			var soundRecorder = new p5.SoundRecorder();
			var soundFile = new p5.SoundFile();
			soundRecorder.record(soundFile);
			sloop.start();
			setTimeout(
				async function() {
					sloop.pause();
					soundRecorder.stop();
					ipfs = await initIpfs();
					let tmp = await ipfs.add(soundFile.getBlob())
					console.log(tmp)
					setIpfsHash(tmp.path)
				}, 10000);
		}
	}

	const preparemint = async () => {
		ipfs = await initIpfs();
		console.log(soundfile)
		const resp = await ipfs.add(soundfile)
		return resp.path
		
	}

	function clearAll() {
		for (var i=0; i<cells.length; i++) {
			cells[i].enabled = false;
		}
	}

	

	var Cell = function(position, pitch) {
		// Sound
		this.pitch = pitch;
		// Appearance
		this.padding = 2;
		this.position = position.copy();
		this.width = cellWidth - 2 * this.padding;
		this.height = cellHeight - 2 * this.padding;
		this.defaultColor = [190, 240, 255];
		// Mouse hover
		this.hovered = false;
		this.hoverColor = [230, 255, 255];
		// Enabled when clicked
		this.enabled = false;
		var varyingColorVal = 22 * (this.pitch % pitches.length);
		this.enabledColor = [20 + varyingColorVal, 255 - varyingColorVal, 255];
		// Active when soundloop plays the cell
		this.active = false;
		this.activeColor = [230, 255, 255];
	  }
	  
	  Cell.prototype.display = function(p) {
		p.noStroke();
		if (this.enabled) {
			p.fill(this.enabledColor[0], this.enabledColor[1], this.enabledColor[2]);
		} else if (this.hovered) {
			p.fill(this.hoverColor[0], this.hoverColor[1], this.hoverColor[2]);
		} else if (this.active) {
			p.fill(this.activeColor[0], this.activeColor[1], this.activeColor[2]);
		} else {
			p.fill(this.defaultColor[0], this.defaultColor[1], this.defaultColor[2]);
		}
		p.rect(this.position.x + this.padding, this.position.y + this.padding, this.width, this.height);
	  }
	  
	  Cell.prototype.checkIfHovered = function(p) {
		var xMin = this.position.x + this.padding;
		var xMax = xMin + this.width;
		var yMin = this.position.y + this.padding;
		var yMax = yMin + this.height;
		if ((p.mouseX > xMin && p.mouseX < xMax) && (p.mouseY > yMin && p.mouseY < yMax)) {
		  this.hovered = true;
		} else {
		  this.hovered = false;
		}
	  }

	  const wannaMint = () => {
		// const ipfsRespHash = await preparemint()
		setCanMint(!canMint)
	  }

    return (
        <Flex direction={"column"} >
			<Flex mt={36}ref={myRef}></Flex>
			{soundfile === null ? <></> : 
			<Button maxW={64} mt={8} mx="auto" onClick={wannaMint}>Mint the recording</Button>}
			{canMint === true ? <MintBtn ipfsHash={ipfsHash}/> : <></> }
        </Flex>
    )
}
