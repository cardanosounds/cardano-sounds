import React from 'react'
import AudioPlayer from '../components/AudioPlayer'
import { NFTData } from '../interfaces/interfaces'
import { 
    Flex,
    SimpleGrid,
    Box 
} from '@chakra-ui/react'


//export default function SoundNFT(soundNFTData: { soundNFTData: string } ) {
export default function SoundNFT(soundNFTData: NFTData) {
    return (
        <Flex
            display="column"
            align="center"
            minH="80vh"
        >
           
                <Box>
                    <AudioPlayer url="https://filesamples.com/samples/audio/flac/sample3.flac" />
                </Box>
            
            {/*<AudioPlayer url={soundNFTData.media} />*/}

        
        </Flex>
    )
}