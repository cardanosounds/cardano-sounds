import React, { useEffect, useRef } from 'react'
import AudioPlayer from '../components/AudioPlayer'
import SoundNFT from '../components/SoundNFT'
import { NFTData } from '../interfaces/interfaces'
//import p5 from 'p5'
import dynamic from "next/dynamic";
import { Flex } from '@chakra-ui/react';

const P5Comp = dynamic(() => import("../components/player2"),
  { ssr: false }
);

const size = { width: 800, height: 800 }

export default function Sounds() {
    
    return (
        <Flex align="center" justify="center" w="100vw" h="100vh">
           {/* <SoundNFT soundNFTData="https://filesamples.com/samples/audio/flac/sample3.flac" />
            <AudioPlayer url={soundNFTData.media} />*/}
            <P5Comp size={size}/>
        </Flex>
    )
}