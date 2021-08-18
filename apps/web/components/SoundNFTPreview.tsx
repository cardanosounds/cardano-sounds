import React from 'react'
import { NFTData } from '../interfaces/interfaces'
import { 
	Flex,
	Stack,
	Heading,
	Text,
	Spacer,
} from '@chakra-ui/react'
import SoundNFTPreviewSmall from './SoundNFTPreviewSmall'

export default function SoundNFTPreview(soundNFTData: { nftData: NFTData } ) {
	return (
		<Flex
			direction="row"
			fontSize="xs"
			w="55vw"
			rounded="2xl"
			padding="1em"
			bgColor="gray.800"
			_hover={{ boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer", zIndex: "999"}}
		>
			<SoundNFTPreviewSmall soundNFTData={soundNFTData.nftData} fullView={true}/>
			<Spacer></Spacer>
			<Stack 
				minW={["85vw", "85vw", "30vw"]}
				align="center"
				justify="center"
			>
				
				<Flex display="column">
					<Heading size="sm">token name:</Heading><a><Text>{soundNFTData.nftData.metadata.token_name}</Text></a>
					<Heading size="sm">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
					<Heading size="sm">web:</Heading><a><Text>{soundNFTData.nftData.metadata.arweave_website_uri}</Text></a>
					<Heading size="sm">rarity color:</Heading><Text>{soundNFTData.nftData.metadata.rarity}</Text>
					<Heading size="sm">probability:</Heading><Text>{soundNFTData.nftData.metadata.probability} %</Text>
					<Heading size="sm">sounds:</Heading>{soundNFTData.nftData.metadata.sounds.map(x => <p key={x.filename}>x.filename</p>)}
					<Heading size="sm">player:</Heading><Text>{soundNFTData.nftData.metadata.player}</Text>
					<Heading size="sm">buying tx:</Heading><Text>{soundNFTData.nftData.tx_Hash}</Text>
				</Flex>
			</Stack>

		</Flex>
	)

}