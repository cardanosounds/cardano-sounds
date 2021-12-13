import { useState, useEffect } from 'react'
import {
  Flex,
  Stack,
} from "@chakra-ui/react"
import SoundNFT from './SoundNFT'
import { DatabaseTx } from '../interfaces/databaseTx'
import TransactionStatus from './TransactionStatus'


const stateNumFromStatus: (status: string) => 1|2|3|4 = (status) => {
    switch(status){
        case "confirmed":
            return 2
        case "generated":
            return 3
        case "finished":
            return 4
        default:
            return 1
    }
}

export default function Transaction({ id } : {id: string}) {

    const [data, setData] = useState<DatabaseTx>(); 
    const [isFinished, finishNFT] = useState<boolean>(false);
    
    useEffect(() => {
        const eventSource = new EventSource(`/api/sale/${id}`);
        // An instance of EventSource by passing the events URL
        console.log(id)
        console.log(`/api/sale/${id}`)
        // A function to parse and update the data state
        const updateData = async (messageEvent: MessageEvent) => {

            console.log("updateData")
            let dbtx: DatabaseTx = null
            try {
                dbtx = JSON.parse(messageEvent.data);
            } catch (e) {
                console.log("Handle error", e);
            }

            if(dbtx !== null) {
                setData(dbtx)
                if (dbtx.status === "finished" || dbtx.status === "error") {
                    finishNFT(true)
                    eventSource.close()
                }
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
                    py={[0, 0, 24]}
                >
                     {isFinished ?
                    <SoundNFT nftData={data.Metadata}/>
                    : 
                    <p>{data?.status}</p>
                    } 

                </Stack>
                { isFinished || typeof(data) === 'undefined'
                    ?
                    <></>
                    :
                    <TransactionStatus state={stateNumFromStatus(data?.status)} />
                } 

            </Flex>
        </>
    )
}
