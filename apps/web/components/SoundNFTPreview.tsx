import React from 'react'
import { NFTData } from '../interfaces/interfaces'

import utilStyles from "../styles/utils.module.css"
import { 
    Flex,
    SimpleGrid,
    Box, 
    Stack,
    Heading,
    Text,
    Spacer,
    Image
} from '@chakra-ui/react'
import SoundNFTPreviewSmall from './SoundNFTPreviewSmall'

export default function SoundNFTPreview(soundNFTData: { soundNFTData: NFTData } ) {
	return (
		<Flex
		  direction="row"
		  fontSize="xs"
		  w="55vw"
		  rounded="2xl"
		  padding="1em"
		  _hover={{ boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer" }}
		  //className={utilStyles.scalebox}
		>
			<SoundNFTPreviewSmall soundNFTData={soundNFTData.soundNFTData} fullView={true}/>
			<Spacer></Spacer>
			<Stack 
			  minW={["85vw", "85vw", "30vw"]}
			  align="center"
			  justify="center"
			>
				<Flex display="column">
					<Heading size="sm">web:</Heading><a><Text>arweave.net</Text></a>
					<Heading size="sm">probability:</Heading><Text>0.00000 %</Text>
					<Heading size="sm">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
					<Heading size="sm">sounds:</Heading><Text>sound1, sound2, sound3, sound4, sound5</Text>
					<Heading size="sm">player:</Heading><Text>glitch</Text>
					<Heading size="sm">buying xx:</Heading><Text>randomTxHash000000111122222333344445555666677777888889999</Text>
					<Heading size="sm">mint tx:</Heading><Text>randomTxHash000000111122222333344445555666677777888889999</Text>
				</Flex>
			</Stack>

		</Flex>
	)

}