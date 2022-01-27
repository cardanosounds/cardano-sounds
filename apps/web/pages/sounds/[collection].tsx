import React, { SyntheticEvent } from "react"
import Error from 'next/error'

import { GetServerSideProps } from 'next'
import {
  Flex,
  SimpleGrid,
  Select,
  Button,
} from "@chakra-ui/react"
import { useState } from 'react'
import { NFTData, SoundListData } from '../../interfaces/interfaces'
import Head from "next/head"
import Layout from "../../components/layout"
import SoundNFTPreviewSmall from "../../components/SoundNFTPreviewSmall"
// import NextChakraLink from "../../components/NextChakraLink"
import { DatabaseTx } from "../../interfaces/databaseTx"
import { ChevronDownIcon } from "@chakra-ui/icons"
// import GlitchText from "../../components/GlitchText"
import { getSoundsNFTData } from "../../lib/sounds"

// const apiPath = "http://localhost:3000/api/"
// const apiPath = "https://cs-main-app.azurewebsites.net/api/"
// const apiPath = "https://csounds-app.azurewebsites.net/api/"
// const apiPath = `http://localhost:${process.env.PORT || 3000}/api/`

export default function SoundList({ errorCode, data }: {
    errorCode: number
    data: SoundListData
    
})
{
  const [ collection, changeCollection ] = useState<string>("all")
  const [ nfts, updateNfts ] = useState<DatabaseTx[]>(data.nfts)
  const [ loadingMore, loadMore ] = useState<boolean>(false)

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
    const res: SoundListData = await fetch("/api/sounds/" + selection + "/1").then(rs => rs.json())
    updateNfts(res.nfts)   
  }

  const loadNewPage = async () => {
      loadMore(true)
      data.page ++

      const res: SoundListData = await fetch("/api/sounds/" + collection + "/" + String(data.page)).then(rs => rs.json())

      updateNfts(nfts.concat(res.nfts))
      loadMore(false)
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
      {/*<Select 
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
      </Select>*/}
      <Flex
        display="column"
        align="center"
        minH="80vh"
        align-items="center"
        justify-content="center"
      >
        <SimpleGrid  w="100%" spacing={["1vh", "1vh", "1vw"]} minH="70vh" 
          
          overflow-x="auto"
          columns={[1,1,2,3]}
        >
          {/* {nfts} */}
          { nfts.map(( nftsound: DatabaseTx ) => (
            <Flex
              rounded="lg"
              py={["3vh", "3vh","3vw"]}
              maxH={["60vh", "60vh", "75vh", "29vw"]}
              key={nftsound.id} 
              // _hover={{ boxShadow: "dark-lg", transform: "scale(1.1)", cursor: "pointer" }}
              >
              {/*href={`/sound/${nftsound.id}`} */}
              <SoundNFTPreviewSmall  soundNFTData={nftsound}/>
            </Flex>
          ))}
        </SimpleGrid>
        <Button isLoading={loadingMore} display="flex" variant={"ghost"} mx="auto" title="Load more" onClick={loadNewPage}><ChevronDownIcon/></Button>
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

      const nftListData = await getSoundsNFTData(collection.toString(), Number(1))
      if(nftListData instanceof String) {
        data = {
          collection: "all",
          page: 1,
          nfts: []
        }
      }
      else {
        data = 
        {
            collection: collection.toString(),
            page: Number(1),
            nfts: nftListData
        }
      }
        // var nftListData = getSoundsNFTData()
        // console.log("nftListData")
        // console.log(nftListData)

        // data = await fetch(apiPath + "sounds/" + collection + "/1").then(res => res.json())
        // console.log(data)
        // if(data == null) {
        //     data = {
        //       collection: "all",
        //       page: 1,
        //       nfts: []
        //   }
        // } 
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
