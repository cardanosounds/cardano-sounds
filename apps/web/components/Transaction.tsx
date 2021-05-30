import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import React from "react"
import { TxStatusData } from "../interfaces/interfaces"
import NextChakraLink from '../components/NextChakraLink'
import {
  Button,
  Flex,
  Heading,
  Stack,
  IconButton, 
  Progress
} from "@chakra-ui/react"



export default function Transaction({ id } : {id: string}) {

    const [data,setData] = useState<string>(); 
    
    useEffect(() => {
        // An instance of EventSource by passing the events URL
        const eventSource = new EventSource(`/api/sale/${id}`);
        console.log(id)
        console.log(`/api/sale/${id}`)
        // A function to parse and update the data state
        const updateData = (messageEvent: MessageEvent) => {
            console.log(messageEvent.data)
            setData(messageEvent.data);
            if (messageEvent.data === "finished" || messageEvent.data === "error") {
                eventSource.close();
            }
        };

        // eventSource now listening to all the events named 'message'
        eventSource.addEventListener('message', updateData);
        // Unsubscribing to the event stream when the component is unmounted
        return () => eventSource.close();
    }, []);
  
    return (
    <>
        <Flex
            display="column"
            align="center"
            justify="center"
            minH="50vh"
        >
            <Stack
              spacing={6}
              align="center"
              margin="auto"
            >

                <Heading
                    as="h1"
                    size="xl"
                    textAlign={["center", "center", "left", "left"]}
                >
                    Mystical Waves
                </Heading>
                <Heading
                    as="h2"
                    size="lg"
                    textAlign={["center", "center", "left", "left"]}
                >
                    limited NFT collection sale
                </Heading>
                <p>{data}</p>

                {/*<div dangerouslySetInnerHTML={{ __html: data.iconFrom }} /> */}


                {/* <div dangerouslySetInnerHTML={{ __html: data.iconTo }} />  */}  
            
            </Stack>
            { data !== id + " done" ? <Progress size="xs" isIndeterminate /> : <></>}

        </Flex>
    </>
  )
}