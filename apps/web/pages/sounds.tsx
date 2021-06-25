import React, { useEffect, useRef } from 'react'
import AudioPlayer from '../components/AudioPlayer'
import SoundNFT from '../components/SoundNFT'
import { NFTData } from '../interfaces/interfaces'
//import p5 from 'p5'
import dynamic from "next/dynamic";
import { Flex, useColorMode } from '@chakra-ui/react';
import Layout from '../components/layout';

const P5Comp = dynamic(() => import("../components/playerSuperFormula"),
  { ssr: false }
);

const size = { width: 800, height: 800 }

export default function Sounds() {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    
    return (
        <Layout>
            <Flex align="center" justify="center" w="100vw">
               {/* <SoundNFT soundNFTData="https://filesamples.com/samples/audio/flac/sample3.flac" />
                <AudioPlayer url={soundNFTData.media} />*/}
                <P5Comp isDark={isDark} />
            </Flex>
        </Layout>
    )
}