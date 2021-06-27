import React, { useEffect, useRef } from 'react'
import AudioPlayer from '../components/AudioPlayer'
import SoundNFT from '../components/SoundNFT'
import { NFTData } from '../interfaces/interfaces'
//import p5 from 'p5'
import dynamic from "next/dynamic";
import { Flex, useColorMode } from '@chakra-ui/react';
import Layout from '../components/layout';

const P5Comp = dynamic(() => import("../components/playerRandomDancers"),
  { ssr: false }
);

export default function PlayerRD() {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    
    return (
        <Layout>
                <P5Comp  isDark={isDark} />
        </Layout>
    )
}