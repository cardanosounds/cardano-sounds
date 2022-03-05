import React from 'react'
import { 
	Flex,
	Stack,
	Heading,
	Text,
	Spacer,
} from '@chakra-ui/react'
import SoundNFTPreviewSmall from './SoundNFTPreviewSmall'
import { DatabaseTx, Metadata } from '../interfaces/databaseTx'

export default function SoundNFTPreview(nftData: { metadata: Metadata } ) {
	return (
		<Flex
			direction={["column", "column", "row"]}
			fontSize="xs"
			w={["90vw", "90vw", "75vw"]}
			mx="auto"
		>	
			<Flex p={[0,0,10]}>
				<SoundNFTPreviewSmall metadata={nftData.metadata} fullView={true}/>
			</Flex>
			<Spacer></Spacer>
			<Stack 
				w={["85vw", "85vw", "30vw"]}
				align="center"
				justify="center"
				lineHeight={2}
				px="1.5rem"
			>
				<Flex 
					display="column"
					wordBreak="break-all"
				>
					{/* <Heading size="sm">token name:</Heading><a><Text>{nftData.metadata.token_name}</Text></a> */}
					{/* <Heading size="sm">policy:</Heading><Text>97de3506172e572d4e7ba9874af2616c41ae3027c9894fde2c484a62</Text>
					<Heading size="sm">web:</Heading><a href={nftData.metadata.arweave_website_uri}><Text>{nftData.metadata.arweave_website_uri}</Text></a>
					<Heading size="sm">rarity color:</Heading><Text>{nftData.metadata.rarity}</Text>
					<Heading size="sm">probability:</Heading><Text>{nftData.metadata.probability} %</Text>
					<Heading size="sm">sounds:</Heading>{nftData.metadata.sounds.map(x => <p key={x.filename}>{x.filename}</p>)}
					<Heading size="sm">player:</Heading><Text>{nftData.metadata.player}</Text> */}
					{/* <Heading size="sm">buying tx:</Heading><Text>{soundNFTData.nftData.tx_hash}</Text> */}
				</Flex>
			</Stack>

		</Flex>
	)

}