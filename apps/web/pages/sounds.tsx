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

const testData: NFTData = {
            ipfs: "string",
            arweave: "string",
            rarity: 1,
            web:"arweavewebsite.net",
            buyingTx: "string",
            mintTx: "string",
            assetHash: "string",
            tokenName: "string",
            attributes: [{
                        name: "string",
                        probability: 0.0000001,
                        media: "string"
                    }
                ]
        
    }


const size = { width: 800, height: 800 }

export default function Sounds() {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    
    return (
        <Layout>
            <Flex align="center" justify="center" minH="85vh" w="100vw">
                <SoundNFT soundNFTData={testData} />
            </Flex>
        </Layout>
    )
}