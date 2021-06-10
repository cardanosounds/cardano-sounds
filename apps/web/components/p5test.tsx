import React, { useEffect, useRef } from 'react'
import AudioPlayer from '../components/AudioPlayer'
import SoundNFT from '../components/SoundNFT'
import { NFTData } from '../interfaces/interfaces'
import p5 from 'p5'


export default function Sounds() {
    let myP5: p5;
    const myRef = useRef()

    useEffect(() => {
        myP5 = new p5(Sketch, myRef.current)
    }, [])

    const Sketch = (p) => {
        p.setup = () => {
         p.background("#ff0000");
        }
    
        p.draw = () => {
       
       }
    }

    return (
        <>
           {/* <SoundNFT soundNFTData="https://filesamples.com/samples/audio/flac/sample3.flac" />
            <AudioPlayer url={soundNFTData.media} />*/}
        <div ref={myRef}>

        </div>
        </>
    )
}