import { Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React, { ComponentType } from "react";
import { NFTData } from "../../interfaces/interfaces";



export default function Sound({nftData}: {nftData: NFTData})
{
    let Player: React.ComponentType<{
        size: {
            width: number;
            height: number;
        };
        isDark: boolean;
        }>
    let playerComp: string
    switch(nftData.player)
    {
        case "glitch":
            {
                Player = dynamic(() => import("../../components/playerGlitch"),
                                        { ssr: false }
                                    );
                break
            }
        case "superformula":
            {
                Player = dynamic(() => import("../../components/playerSuperFormula"),
                                    { ssr: false }
                                );
                break
            }
        case "randomDancers":
            {
                Player = dynamic(() => import("../../components/playerRandomDancers"),
                                        { ssr: false }
                                    );
                break
            }
        default:
            Player = dynamic(() => import("../../components/playerColors"),
                                        { ssr: false }
                                    );
            break
    }
    
	return (
		<>
            <Flex>
                <Player size={{height: 400, width: 400}} isDark={false}/>
                <Spacer></Spacer>
                <Stack 
                    minW={["85vw", "85vw", "30vw"]}
                    align="center"
                    justify="center"
                >
                    <Flex display="column">
                        <Heading size="sm">web:</Heading><a><Text>{nftData.web}</Text></a>
                        <Heading size="sm">probability:</Heading><Text>{nftData.rarity} %</Text>
                        <Heading size="sm">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
                        <Heading size="sm">sounds:</Heading><Text>sound1, sound2, sound3, sound4, sound5</Text>
                        <Heading size="sm">player:</Heading><Text>{nftData.player}</Text>
                        <Heading size="sm">buying tx:</Heading><Text>{nftData.buyingTx}</Text>
                        <Heading size="sm">mint tx:</Heading><Text>{nftData.mintTx}</Text>
                    </Flex>
                </Stack>
            </Flex>
		</>
	)
}

export const getServerSideProps = async (context) => {
    // ...
    const { tokenname } = context.query

    let data: NFTData

    data = null
    if(data == null) {
        data = {
            ipfs: "string",
            arweave: "string",
            rarity: 1,
            web:"arweavewebsite.net",
            buyingTx: "string",
            mintTx: "string",
            assetHash: "string",
            tokenName: "string",
            attributes: [{
                        name: "string",
                        probability: 0.0000001,
                        media: "string"
                    }
                ],
            player:"superformula"        
        }
    }
       // console.log(data)
    return {
        props: {nftData: data}
    }
}