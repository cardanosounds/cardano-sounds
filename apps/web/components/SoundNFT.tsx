import React from 'react'
import { NFTData } from '../interfaces/interfaces'
import { 
    Flex,
    SimpleGrid,
    Box, 
    Stack,
    Heading,
    Text
} from '@chakra-ui/react'
import dynamic from 'next/dynamic';

const PlayerGlitch = dynamic(() => import("../components/playerGlitch"),
  { ssr: false }
);

export default function SoundNFT(soundNFTData: { soundNFTData: NFTData } ) {

    return (
        <Flex
            display="row"
            align="center"
            minH="60vh"
            minW="60vw"
        >
           
                <Box>
                    <PlayerGlitch size={{width:400, height:400}} isDark/>
                </Box>
                <Stack w="30vw">
                    <Flex display="column">
                        <Heading>name:</Heading><Text>DEVCSNFT0</Text>
                        <Heading>probability:</Heading><Text>0.00000 %</Text>
                        <Heading>policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
                        <Heading>sounds:</Heading><Text>sound1, sound2, sound3, sound4, sound5</Text>
                        <Heading>player:</Heading><Text>glitch</Text>
                        <Heading>buyingTx:</Heading><Text>randomTxHash000000111122222333344445555666677777888889999</Text>
                    </Flex>
                </Stack>
        </Flex>
    )
}