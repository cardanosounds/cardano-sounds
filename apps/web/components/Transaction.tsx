import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import React from "react"
import { NFTData, TxStatusData } from "../interfaces/interfaces"
import NextChakraLink from '../components/NextChakraLink'
import {
  Button,
  Flex,
  Heading,
  Stack,
  IconButton, 
  Progress
} from "@chakra-ui/react"
import SoundNFT from './SoundNFT'

const testData: NFTData = {
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

export default function Transaction({ id } : {id: string}) {

    const [data,setData] = useState<string>(); 
    const [isFinished, finishNFT] = useState<boolean>(false);
    
    useEffect(() => {
        // An instance of EventSource by passing the events URL
        const eventSource = new EventSource(`/api/sale/${id}`);
        console.log(id)
        console.log(`/api/sale/${id}`)
        // A function to parse and update the data state
        const updateData = (messageEvent: MessageEvent) => {
            console.log(messageEvent.data)
            setData(messageEvent.data)
            if (messageEvent.data === "NFT created" || messageEvent.data === "error") {
                finishNFT(true)
                eventSource.close()
            }
        };

        // eventSource now listening to all the events named 'message'
        eventSource.addEventListener('message', updateData)
        // Unsubscribing to the event stream when the component is unmounted
        return () => eventSource.close()
    }, []);
  
    return (
    <>
        <Flex
            display="column"
            align="center"
            justify="center"
            //minH="50vh"
        >
            <Stack
              spacing={6}
              align="center"
              margin="auto"
            >
                {isFinished ?
                <SoundNFT soundNFTData={testData}/>
                :
                <p>{data}</p>
                }

            </Stack>
            { !isFinished ? <Progress size="xs" isIndeterminate /> : <></>}

        </Flex>
    </>
  )
}