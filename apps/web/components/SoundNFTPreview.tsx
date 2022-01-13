import React from 'react'
import { 
	Flex,
	Stack,
	Heading,
	Text,
	Spacer,
} from '@chakra-ui/react'
import SoundNFTPreviewSmall from './SoundNFTPreviewSmall'
import { DatabaseTx } from '../interfaces/databaseTx'

export default function SoundNFTPreview(soundNFTData: { nftData: DatabaseTx } ) {
	return (
		<Flex
			direction={["column", "column", "row"]}
			fontSize="xs"
			w={["90vw", "90vw", "75vw"]}
			mx="auto"
			// _hover={{ boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer", zIndex: "999"}}
		>	
			<Flex p={[0,0,10]}>
				<SoundNFTPreviewSmall soundNFTData={soundNFTData.nftData} fullView={true}/>
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
					{/* <Heading size="sm">token name:</Heading><a><Text>{soundNFTData.nftData.Metadata.token_name}</Text></a> */}
					<Heading size="sm">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
					<Heading size="sm">web:</Heading><a href={soundNFTData.nftData.Metadata.arweave_website_uri}><Text>{soundNFTData.nftData.Metadata.arweave_website_uri}</Text></a>
					<Heading size="sm">rarity color:</Heading><Text>{soundNFTData.nftData.Metadata.rarity}</Text>
					<Heading size="sm">probability:</Heading><Text>{soundNFTData.nftData.Metadata.probability} %</Text>
					<Heading size="sm">sounds:</Heading>{soundNFTData.nftData.Metadata.sounds.map(x => <p key={x.filename}>{x.filename}</p>)}
					<Heading size="sm">player:</Heading><Text>{soundNFTData.nftData.Metadata.player}</Text>
					<Heading size="sm">buying tx:</Heading><Text>{soundNFTData.nftData.tx_hash}</Text>
				</Flex>
			</Stack>

		</Flex>
	)

}