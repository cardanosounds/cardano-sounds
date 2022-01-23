import { useState, useEffect } from 'react'
import {
  Flex,
  Stack,
} from "@chakra-ui/react"
import SoundNFT from './SoundNFT'
import { DatabaseTx, instanceOfDatabaseTx } from '../interfaces/databaseTx'
import TransactionStatus from './TransactionStatus'
import SoundNFTPreviewSmall from './SoundNFTPreviewSmall'


const stateNumFromStatus: (status?: string) => 1|2|3|4 = (status) => {
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

    const [data, setData] = useState<DatabaseTx | string>(); 
    const [isFinished, finishNFT] = useState<boolean>(false);
    
    useEffect(() => {
        const eventSource = new EventSource(`/api/sale/${id}`);
        // An instance of EventSource by passing the events URL
        // console.log(id)
        // console.log(`/api/sale/${id}`)
        // A function to parse and update the data state
        const updateData = async (messageEvent: MessageEvent) => {

            // console.log("updateData")
            if(messageEvent.data === "not found") {
                // console.log(messageEvent.data)
                setData(messageEvent.data.toString())
            } else {
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
                direction={["row", "row", "column-reverse"]}
                //minH="50vh"
            >
                <Flex
                    spacing={6}
                    align="center"
                    margin="auto"
                    ml={["30vw", "30vw", "auto"]}
                    mt={["10vh", "10vh", "auto"]}
                    py={[0, 0, 24]}
                >
                    {isFinished && instanceOfDatabaseTx(data) ?
                    <SoundNFTPreviewSmall soundNFTData={data}/>
                    : 
                    <>
                        {statusFullText(typeof(data) === 'undefined' || data === 'not found' ? data : instanceOfDatabaseTx(data) ? data.status : '' )}
                    </>
                    } 

                </Flex>
                <Flex>
                    { isFinished || typeof(data) === 'undefined'
                        ?
                        <></>
                        :
                        <TransactionStatus 
                            state={
                                stateNumFromStatus(typeof(data) === 'undefined' || data === 'not found' ? data : instanceOfDatabaseTx(data) ? data.status : '') 
                            } 
                        />
                    } 
                </Flex>
            </Flex>
        </>
    )
}

const statusFullText = (status?: string) => {
    if (status === null || status === '' || status === 'not found') return "Waiting for confirmation..."
    switch(status) {
        case 'confirmed':
            return "Your transaction was confirmed and added into queue for generative process."
        case 'generated':
            return "Your NFT content was generated and added into queue for minting process."
        case 'finished':
            return "Your NFT was minted!"
        default:
            return status
    }
}