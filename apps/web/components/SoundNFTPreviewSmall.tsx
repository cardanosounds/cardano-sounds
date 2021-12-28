import React, { useEffect } from 'react'
import { 
	Flex,
	Box, 
	Heading,
	Image
} from '@chakra-ui/react'
import { DatabaseTx } from '../interfaces/databaseTx'
import Gifffer from '../lib/gifffer-custom'



export default function SoundNFTPreviewSmall({soundNFTData, fullView}: { soundNFTData: DatabaseTx, fullView?: boolean } ) {
	// const imageFilePath = fullView ? "glitch-light-v1.PNG" : "../../../glitch-light-v1.PNG"
	const imageFilePath = 'https://infura-ipfs.io/ipfs/' + soundNFTData.Metadata.image

	const hoverShadow = fullView ? {boxShadow: "unset" } : { boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer" }
	const audioPath = 'https://arweave.net/' + soundNFTData.Metadata.arweave_id_sound
	useEffect(() => {
		Gifffer();
	},[])

	return (
		
		<Flex
			direction="column"
			w={["85vw", "85vw", "30vw", "20vw"]}
			textAlign="center"
			hover={ hoverShadow }  
			mx="auto"
		>
			<Box
				rounded="lg"
				//bg="rgba(0,0,0,0.2)"
				h={["85vw", "85vw", "30vw", "20vw"]}
				w={["85vw", "85vw", "30vw", "20vw"]}
				mb="1vh"
				// bgImage={`url('${imageFilePath}')`}
				
			>
				{/*<Flex
					backgroundColor="rgb(0,0,0, 0.2)"
					pos="absolute"
					left="0px"
					top="0px"
					rounded="2xl"
					w="25vw"
					h="25vw"
					z-index="2"
				></Flex>
				 _hover={{animationPlayState: "running"}}*/}
				 <img audio-data-gifffer={audioPath} audio-giffer-format="audio/flac" data-gifffer={imageFilePath} />
				{/* <Image src={imageFilePath} style={{animationPlayState: "paused"}} rounded="lg" pos="relative" /> */}
			</Box>
			<Heading size="sm">{soundNFTData.Metadata?.token_name}</Heading>
			{/*<Text
				wordBreak="break-all"
			>
				be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a
			</Text>*/}
		</Flex>
			
	)

}