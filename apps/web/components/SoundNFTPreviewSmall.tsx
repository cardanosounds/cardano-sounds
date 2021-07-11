import React from 'react'
import { NFTData } from '../interfaces/interfaces'
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




export default function SoundNFTPreviewSmall({soundNFTData, fullView}: { soundNFTData: NFTData, fullView?: boolean } ) {
	const imageFilePath = fullView ? "glitch-light-v1.PNG" : "../../../glitch-light-v1.PNG"

	const hoverShadow = fullView ? {boxShadow: "unset" } : { boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer" }

	return (
		
		<Flex
			direction="column"
			w={["85vw", "85vw", "30vw", "20vw"]}
			textAlign="center"
			hover={ hoverShadow }  
		>
			<Box
				rounded="2xl"
				pos="relative"
				bg="rgba(0,0,0,0.2)"
				h="20vw"
				mb="1vh"
				_before={{
				content: '""',
				rounded:"2xl",
				bgImage:`url('${imageFilePath}')`,
				bgSize: "cover",
				pos: "absolute",
				top: 0,
				right: 0,
				left: 0,
				bottom: 0,
				opacity:0.8
				}}
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
				<Image src="glitch-light-v1.PNG" rounded="2xl" pos="relative" />*/}
			</Box>
			<Heading size="sm">DEVCSNFT0</Heading>
			<Text
				wordBreak="break-all"
			>
				be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a
			</Text>
		</Flex>
			
	)

}