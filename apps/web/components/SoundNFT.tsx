import { Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { NFTData } from "../interfaces/interfaces";


export default function SoundNFT({nftData}: {nftData?: NFTData})
{
    let Player: React.ComponentType<{
        size: {
            width: number;
            height: number;
        };
        isDark: boolean;
    }>


    switch(nftData?.metadata?.player)
    {
        case "glitch":
            {
                Player = dynamic(() => import("./playerGlitch"),
                                    { ssr: false }
                                );
                break
            }
            case "superformula":
            {
                Player = dynamic(() => import("./playerSuperFormula"),
                                    { ssr: false }
                                );
                break
            }
            case "randomDancers":
            {
                Player = dynamic(() => import("./playerRandomDancers"),
                                    { ssr: false }
                                );
                break
            }
            case "colors":
            {
                Player = dynamic(() => import("./playerColors"),
                                    { ssr: false }
                                );
                break
            }
        default:
            Player = null
            break
        }
        
        return (
            <>
            
                {nftData ?
                <Flex minH="60vh">
                    <Player size={{height: 400, width: 400}} isDark={false}/>
                    <Spacer></Spacer>
                    <Stack 
                        minW={["85vw", "85vw", "30vw"]}
                        align="center"
                        justify="center"
                    >
                        <Flex display="column">
                            <Heading size="sm">token name:</Heading><a><Text>{nftData.metadata.token_name}</Text></a>
                            <Heading size="sm">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
                            <Heading size="sm">web:</Heading><a><Text>{nftData.metadata.arweave_website_uri}</Text></a>
                            <Heading size="sm">rarity color:</Heading><Text>{nftData.metadata.rarity}</Text>
                            <Heading size="sm">probability:</Heading><Text>{nftData.metadata.probability} %</Text>
                            <Heading size="sm">sounds:</Heading><Text>{nftData.metadata.sounds.map(x => <p>x.filename</p>)}</Text>
                            <Heading size="sm">player:</Heading><Text>{nftData.metadata.player}</Text>
                            <Heading size="sm">buying tx:</Heading><Text>{nftData.tx_Hash}</Text>
                        </Flex>
                    </Stack>
                </Flex>
                :
                <>
                    <Flex minH="60vh" align="center" justify="center">
                        <Heading size="md">Couldn't find sound you were looking for...</Heading>
                    </Flex>
                </>}
		</>
	)
}