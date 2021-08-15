import React, { SyntheticEvent } from "react"
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
  const [ collection, changeCollection ] = useState<string>("all")
  const [ nfts, updateNfts ] = useState<NFTData[]>(data.nfts)

  const changeCollectionOption = async (selectedIndex: number) => {
    let selection: string = "wave"
    if(selectedIndex == 0 || selectedIndex == 1)
    {
      selection = "all"
    }
    else 
    {
      selection += selectedIndex
    }
    if(selection == collection) return
    changeCollection(selection)
    const res: SoundListData = await fetch(apiPath + "sounds/" + selection + "/1").then(rs => rs.json())
    updateNfts(res.nfts)   
  }

  const loadNewPage = async () => {
      //if(data.last) return

      data.page ++

      const res: SoundListData = await fetch(apiPath + "sounds/" + collection + "/" + String(data.page)).then(rs => rs.json())

      //data.last = res.last

      updateNfts(nfts.concat(res.nfts))
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
      mt={["18vh", "17vh", "25vh", "25vh", "20vh"]}
      mx="auto"
    >
      <Select 
        variant="outline" 
        placeholder="Select collection" 
        mt="3vw" ml={["5vw", "5vw", "3vw"]} 
        mb={0} 
        maxW={["70vw", "65vw", "50vw", "45vw"]}
        onChange={async (e) => await changeCollectionOption(e.target.options.selectedIndex)} 
      >
        <option value="all">All</option>
        <option value="wave1">Wave 1</option>
        <option value="wave2">Wave 2</option>
        <option value="wave3">Wave 3</option>
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
          { nfts.map(( nftsound: NFTData ) => (
            <NextChakraLink
              rounded="2xl"
              py={["3vh", "3vh","3vw"]}
              maxH={["60vh", "60vh", "75vh", "29vw"]}
              key={nftsound.id} href={`/sound/${nftsound.id}`} 
              _hover={{ boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer" }}
            >
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
        //data = await fetch(apiPath + "sounds/" + collection + "/1").then(res => res.json())
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
