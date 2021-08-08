import React from "react"
import Error from 'next/error'

import { GetServerSideProps } from 'next'
import {
  Flex,
  SimpleGrid,
  Select,
} from "@chakra-ui/react"
import { useState } from 'react'
import { NFTData, SoundListData } from '../../interfaces/interfaces'
import Head from "next/head"
import Layout from "../../components/layout"
import SoundNFTPreviewSmall from "../../components/SoundNFTPreviewSmall"
import NextChakraLink from "../../components/NextChakraLink"

const apiPath = "http://localhost:3000/api/"

export default function SoundList({ errorCode, data }: {
    errorCode: number
    data: SoundListData
    
})
{
  const [ collection, changeCollection ] = useState<String>("all")

  const loadNewPage = async () => {
      //if(data.last) return

      data.page += 1

      const res: SoundListData = await fetch(apiPath + "sounds/" + collection + "/" + String(data.page)).then(rs => rs.json())

      //data.last = res.last

      data.nfts = data.nfts.concat(res.nfts)
  }


  if (errorCode !== null) {
    return <Error statusCode={errorCode} title="Something is wrong."/>
  }
  else {}
  return (
    <Layout>
      <Head>
        <title>CardanoSounds - NFTs</title>
      </Head>
    <Flex
      display="column"
      align="center"
      justify="center"
      maxW={["95vw", "90vw", "80vw"]}
      minH="60vh"
      mt={["15vh", "15vh", "25vh", "20vh"]}
      mx="auto"
    >
      <Select variant="outline" placeholder="Select collection" ml={["5vw", "5vw", "3vw"]} mb={["5vw", "5vw", "3vw"]} maxW={["70vw", "65vw", "50vw", "45vw"]}>
        <option onSelect={() => { changeCollection }} value="all">All</option>
        <option onSelect={() => { changeCollection }}  value="wave1">Wave 1</option>
        <option onSelect={() => { changeCollection }}  value="wave2">Wave 2</option>
        <option onSelect={() => { changeCollection }}  value="wave3">Wave 3</option>
      </Select>
      <Flex
        display="column"
        align="center"
        minH="80vh"
      >
        <SimpleGrid  w="100%" spacing={["1vh", "1vh", "1vw"]} minH="70vh" 
          align-items="center"
          justify-content="center"
          overflow-x="auto"
          columns={[1,1,2,3]}
        >
          { data.nfts.map(( nftsound: NFTData ) => (
            <NextChakraLink key={nftsound.id} href={`/sound/${nftsound.id}`}>
              <SoundNFTPreviewSmall  soundNFTData={nftsound}/>
            </NextChakraLink>
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ...
    let errorCode: number = null;

    const { collection } = context.query

    let data: SoundListData

    if (errorCode === null) {
        //data = await fetch(apiPath + "sounds/" + collection + "/" + page).then(res => res.json())
        if(data == null) {
            data = {
                collection: "all",
                page: 1,
                nfts: [{
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
                            arweave_website_uri: ""        
                        },
                        status: "done",
                        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
                        created: "8/4/2021 10:00pm"
                        },
                        {
                        amount: [{quantity: 25000000, unit: "lovelace"}],
                        id: "CSNFT2",
                        output_Index: 0,
                        senderAddress: "addr112233334444555666678777788888999911100000",
                        metadata: {
                            arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
                            ipfs_id_sound: "ipfs://",
                            image: "ipfs://",
                            player: "superformula-2-dark",
                            id: "CSNFT2",
                            probability: 0.001,
                            rarity: "",
                            sounds: [
                                {category: "enrichment", probability: 0.01, filename: "sound1"},
                                {category: "melody", probability: 0.01, filename: "sound2"},
                                {category: "bass", probability: 0.01, filename: "sound3"},
                                {category: "enrichment", probability: 0.01, filename: "sound4"},
                                {category: "enrichment", probability: 0.01, filename: "sound5"}
                            ],
                            token_name: "CSNFT2",
                            arweave_website_uri: ""        
                        },
                        status: "done",
                        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
                        created: "8/4/2021 10:05pm"
                        },
                        {
                        amount: [{quantity: 25000000, unit: "lovelace"}],
                        id: "CSNFT3",
                        output_Index: 0,
                        senderAddress: "addr112233334444555666678777788888999911100000",
                        metadata: {
                            arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
                            ipfs_id_sound: "ipfs://",
                            image: "ipfs://",
                            player: "randomdancers-light",
                            id: "CSNFT3",
                            probability: 0.001,
                            rarity: "",
                            sounds: [
                                {category: "enrichment", probability: 0.01, filename: "sound1"},
                                {category: "melody", probability: 0.01, filename: "sound2"},
                                {category: "bass", probability: 0.01, filename: "sound3"},
                                {category: "enrichment", probability: 0.01, filename: "sound4"},
                                {category: "enrichment", probability: 0.01, filename: "sound5"}
                            ],
                            token_name: "CSNFT3",
                            arweave_website_uri: ""        
                        },
                        status: "done",
                        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
                        created: "8/4/2021 10:10pm"
                        }, 
              ]
            }
        }
    }
    else {
        data = {
            collection: "all",
            page: 1,
            nfts: []
        }
    }
    
    return {
        props: {
          errorCode,
          data
        },
    }
}
