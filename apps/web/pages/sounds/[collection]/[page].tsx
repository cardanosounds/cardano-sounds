import React from "react"
import Error from 'next/error'

import { GetServerSideProps } from 'next'
import {
  Flex,
  SimpleGrid,
  useColorMode,
  Select,
} from "@chakra-ui/react"
import { useState } from 'react'
import { NFTData, SoundListData } from '../../../interfaces/interfaces'
import Head from "next/head"
import Layout from "../../../components/layout"
import SoundNFTPreviewSmall from "../../../components/SoundNFTPreviewSmall"

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
      mt="15vh"
      ml="10vw"
    >
      <Select variant="outline" placeholder="Select collection">
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
        <SimpleGrid  w="100%" spacing="1vw" minH="70vh" 
          align-items="center"
          justify-content="center"
          overflow-x="auto"
          columns={[1,2,2,3]}
        >
         { data.nfts.map(( nftsound: NFTData ) => (
           <SoundNFTPreviewSmall soundNFTData={nftsound}/>
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
    const { page } = context.query

    let data: SoundListData

    if (errorCode === null) {
        data = await fetch(apiPath + "sounds/" + collection + "/" + page).then(res => res.json())
        if(data == null) {
            data = {
                collection: "all",
                page: 1,
                nfts: []
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
