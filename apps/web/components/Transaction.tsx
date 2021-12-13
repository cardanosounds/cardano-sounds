import { useState, useEffect } from 'react'
import {
  Flex,
  Stack,
  CircularProgress,
  CircularProgressLabel,
  Box
} from "@chakra-ui/react"
import SoundNFT from './SoundNFT'
import { DatabaseTx } from '../interfaces/databaseTx'
import TransactionStatus from './TransactionStatus'


// const testData: NFTData = {
//     amount: [{quantity: 25000000, unit: "lovelace"}],
//     id: "CSNFT1",
//     output_Index: 0,
//     senderAddress: "addr112233334444555666678777788888999911100000",
//     metadata: {
//         arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
//         ipfs_id_sound: "ipfs://",
//         image: "ipfs://",
//         player: "randomdancers-light",
//         id: "CSNFT1",
//         policy_id: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
//         probability: 0.001,
//         rarity: "",
//         sounds: [
//             {category: "enrichment", probability: 0.01, filename: "sound1"},
//             {category: "melody", probability: 0.01, filename: "sound2"},
//             {category: "bass", probability: 0.01, filename: "sound3"},
//             {category: "enrichment", probability: 0.01, filename: "sound4"},
//             {category: "enrichment", probability: 0.01, filename: "sound5"}
//         ],
//         token_name: "CSNFT1",
//         arweave_website_uri: "arweave.net/play"        
//     },
//     status: "done",
//     tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
//     created: "8/4/2021 10:00pm"
// }
// const valueFromStatus: (status: string) => number = (status) => {
//     switch(status){
//         case "confirmed":
//             return 33
//         case "generated":
//             return 66
//         case "finished":
//             return 100
//         default:
//             return 0
//     }
// }

const delay = ms => new Promise(res => setTimeout(res, ms));

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
                // else if (dbtx.status === "generated") {
                //     eventSource.close()
                // }
                // else{
                //     await delay(5000) 
                // }
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
                    py={24}
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
                    // <CircularProgress value={valueFromStatus(data.status)} color="gray.400">
                    //     <CircularProgressLabel>{data.status}</CircularProgressLabel>
                    // </CircularProgress>
                } 

            </Flex>
        </>
    )
}
