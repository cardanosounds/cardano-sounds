import { Flex, Heading, Spacer, Stack, Text } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React, { ComponentType } from "react";
import { NFTData } from "../../interfaces/interfaces";

export default function Sound(nftData: {nftData: NFTData})
{
    let playerComp: string
    switch(nftData.nftData.player)
    {
        case "glitch":
            {
                playerComp = "../../components/playerGlitch"
                break
            }
        case "superformula":
            {
                playerComp = "../../components/playerSuperFormula"
                break
            }
        case "randomDancers":
            {
                playerComp = "../../components/playerRandomDancers"
            }
        default:
            playerComp = "../../components/playerColors"
    }
    const Player: ComponentType<{nftData: NFTData}> = dynamic(() => import(playerComp),
        { ssr: false }
    );
    const data = nftData.nftData
	return (
		<>
            <Flex>
                <Player nftData={data}/>
                <Spacer></Spacer>
                <Stack 
                    minW={["85vw", "85vw", "30vw"]}
                    align="center"
                    justify="center"
                >
                    <Flex display="column">
                        <Heading size="sm">web:</Heading><a><Text>{data.web}</Text></a>
                        <Heading size="sm">probability:</Heading><Text>{data.rarity} %</Text>
                        <Heading size="sm">policy:</Heading><Text>be3a4e111a307643783820c2bf15fcace87f161187be9301857b593a</Text>
                        <Heading size="sm">sounds:</Heading><Text>sound1, sound2, sound3, sound4, sound5</Text>
                        <Heading size="sm">player:</Heading><Text>{data.player}</Text>
                        <Heading size="sm">buying tx:</Heading><Text>{data.buyingTx}</Text>
                        <Heading size="sm">mint tx:</Heading><Text>{data.mintTx}</Text>
                    </Flex>
                </Stack>
            </Flex>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
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
            player:"glitch"        
        }
    }
        
    return {
        props: {
          data
        },
    }
}