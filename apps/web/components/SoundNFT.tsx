import React from 'react'
import { NFTData } from '../interfaces/interfaces'
import { 
    Flex,
    SimpleGrid,
    Box, 
    Stack,
    Heading,
    Text,
    Spacer
} from '@chakra-ui/react'
import dynamic from 'next/dynamic';

const PlayerGlitch = dynamic(() => import("../components/playerGlitch"),
  { ssr: false }
);

export default function SoundNFT(soundNFTData: { soundNFTData: NFTData } ) {

    return (
        <Flex
            direction={["column", "column", "row"]}
            align="center"
            minH="80vh"
            minW="80vw"
        >
           
                <Box mt={["15vh", "15vh", "unset"]}>
                    <PlayerGlitch size={{width:450, height:450}} isDark={false}/>
                </Box>
                <Spacer></Spacer>
                <Stack w={["85vw", "85vw", "30vw"]}>
                    <Flex display="column">
                        <Heading size="md">name:</Heading><Text>DEVCSNFT0</Text>
                        <Heading size="md">probability:</Heading><Text>0.00000 %</Text>
                        <Heading size="md">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
                        <Heading size="md">sounds:</Heading><Text>sound1, sound2, sound3, sound4, sound5</Text>
                        <Heading size="md">player:</Heading><Text>glitch</Text>
                        <Heading size="md">buying xx:</Heading><Text>randomTxHash000000111122222333344445555666677777888889999</Text>
                        <Heading size="md">mint tx:</Heading><Text>randomTxHash000000111122222333344445555666677777888889999</Text>
                    </Flex>
                </Stack>
        </Flex>
    )
}