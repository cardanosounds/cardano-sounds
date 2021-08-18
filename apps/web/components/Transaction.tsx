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
  Progress,
  CircularProgress,
  CircularProgressLabel
} from "@chakra-ui/react"
import SoundNFT from './SoundNFT'

const testData: NFTData = {
    amount: [{quantity: 25000000, unit: "lovelace"}],
    id: "CSNFT1",
    output_Index: 0,
    senderAddress: "addr112233334444555666678777788888999911100000",
    metadata: {
        arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
        ipfs_id_sound: "ipfs://",
        image: "ipfs://",
        player: "randomdancers-light",
        id: "CSNFT1",
        policy_id: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
        probability: 0.001,
        rarity: "",
        sounds: [
            {category: "enrichment", probability: 0.01, filename: "sound1"},
            {category: "melody", probability: 0.01, filename: "sound2"},
            {category: "bass", probability: 0.01, filename: "sound3"},
            {category: "enrichment", probability: 0.01, filename: "sound4"},
            {category: "enrichment", probability: 0.01, filename: "sound5"}
        ],
        token_name: "CSNFT1",
        arweave_website_uri: "arweave.net/play"        
    },
    status: "done",
    tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
    created: "8/4/2021 10:00pm"
}

const valueFromStatus: (status: string) => number = (status) => {
    switch(status){
        case "new":
            return 33
        case "generated":
            return 66
        case "done":
            return 100
        default:
            return 0
    }
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
            if (messageEvent.data === "done" || messageEvent.data === "error") {
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
                    <SoundNFT nftData={testData}/>
                    :
                    <p>{data}</p>
                    }

                </Stack>
                { isFinished 
                    ?
                    <></>
                    : 
                    <CircularProgress value={valueFromStatus(data)} color="gray.400">
                        <CircularProgressLabel>{data}</CircularProgressLabel>
                    </CircularProgress>
                }

            </Flex>
        </>
    )
}