import React, { useEffect, useState } from 'react'
import { 
	Flex,
	Box, 
	Heading,
	Image,
	Spacer
} from '@chakra-ui/react'
import Gifffer from '../lib/gifffer-custom'
import GlitchText from './GlitchText'
import NextChakraLink from './NextChakraLink'
import { Metadata } from '@prisma/client'



export default function SoundNFTPreviewSmall({metadata, fullView}: { metadata: Metadata, fullView?: boolean } ) {
	const [ glitching, setGlitching ]= useState<boolean>(false)

	const imageFilePath = 'https://infura-ipfs.io/ipfs/' + metadata?.image

	const hoverShadow = { strokeWidth: "1em", strokeDashoffset: "0",  strokeDasharray: "760", cursor: "pointer" }
	const audioPath = 'https://arweave.net/' + metadata?.arweave_id_sound

	useEffect(() => {
		Gifffer();
	},[])
	
	const glitchingText = (text: string) => {
		if(glitching) return <GlitchText>{text}</GlitchText>
	
		return <>{text}</>
	}

	return (
			<Flex
				direction="column"
				rounded="2em"
				w={["85vw", "85vw", "30vw", "20vw"]}
				textAlign="center"
				_hover={hoverShadow}
				mx="auto"
				strokeDasharray={760}
				strokeDashoffset={0}
				strokeWidth="2px"
				fill="transparent"
				stroke="#19f6e8"
				transition="stroke-width 1s, stroke-dashoffset 1s, stroke-dasharray 1s"
			>
				<Box
					rounded="lg"
					h={["85vw", "85vw", "30vw", "20vw"]}
					w={["85vw", "85vw", "30vw", "20vw"]}
					
				>
					<img
						audio-data-gifffer={audioPath} audio-giffer-format="audio/flac" data-gifffer={imageFilePath} 
					/>
				</Box>
				<NextChakraLink 
					href={`${metadata?.arweave_website_uri}`}
					target="_blank"
					onMouseOver={() => {if(!glitching) setGlitching(true) }} onMouseOut={() => { if(glitching) setGlitching(false)}}
				>
					<Flex direction="column">
						<Flex 
							direction="row"
							px="1.25rem"
						>
							<Heading 
								size="sm"
								mb="1em"
							>
								{glitchingText("name:")}
							</Heading>
							<Spacer/>
							<Heading 
								size="sm"
								mb="1em"
							>
								{glitchingText(metadata?.token_name)}
							</Heading>

						</Flex>
					</Flex>
				</NextChakraLink>	
				
			</Flex>
	)

}