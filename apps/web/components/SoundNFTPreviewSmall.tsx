import React, { useEffect, useState } from 'react'
import { 
	Flex,
	Box, 
	Heading,
	Image,
	Spacer
} from '@chakra-ui/react'
import { DatabaseTx } from '../interfaces/databaseTx'
import Gifffer from '../lib/gifffer-custom'
import GlitchText from './GlitchText'
import NextChakraLink from './NextChakraLink'



export default function SoundNFTPreviewSmall({soundNFTData, fullView}: { soundNFTData: DatabaseTx, fullView?: boolean } ) {
	const [ glitching, setGlitching ]= useState<boolean>(false)

	// const imageFilePath = fullView ? "glitch-light-v1.PNG" : "../../../glitch-light-v1.PNG"
	const imageFilePath = 'https://infura-ipfs.io/ipfs/' + soundNFTData.Metadata?.image

	const hoverShadow = { strokeWidth: "1em", strokeDashoffset: "0",  strokeDasharray: "760", cursor: "pointer" }
	// const hoverShadow = fullView ? {boxShadow: "unset" } : { boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer" }
	const audioPath = 'https://arweave.net/' + soundNFTData.Metadata?.arweave_id_sound

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
					//bg="rgba(0,0,0,0.2)"
					h={["85vw", "85vw", "30vw", "20vw"]}
					w={["85vw", "85vw", "30vw", "20vw"]}
					// bgImage={`url('${imageFilePath}')`}
					
				>
					<img
						audio-data-gifffer={audioPath} audio-giffer-format="audio/flac" data-gifffer={imageFilePath} 
					/>
					{/* <Image src={imageFilePath} style={{animationPlayState: "paused"}} rounded="lg" pos="relative" /> */}
				</Box>
				<NextChakraLink 
					href={`/sound/${soundNFTData.Metadata?.token_name}`}
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
								{glitchingText(soundNFTData.Metadata?.token_name)}
							</Heading>

						</Flex>
						{fullView ? <></>
						:
						<Flex 
							direction="row"
							
							px="1.25rem"
						>
							<Heading 
								size="sm"
								mb="1em"
							>
								{glitchingText("web:")}
							</Heading>
							<Spacer/>
							<a href={soundNFTData.Metadata?.arweave_website_uri}>
								<Heading 
									size="sm"
									mb="1em"
									whiteSpace="nowrap"
									overflow="hidden"
									textOverflow="ellipsis"
									maxW="15rem"
								>
									{glitchingText(soundNFTData.Metadata?.arweave_website_uri)}
								</Heading>
							</a>
						</Flex> }
					</Flex>
				</NextChakraLink>	
				
				{/*<Text
					wordBreak="break-all"
				>
					97de3506172e572d4e7ba9874af2616c41ae3027c9894fde2c484a62
				</Text>*/}
			</Flex>
	)

}