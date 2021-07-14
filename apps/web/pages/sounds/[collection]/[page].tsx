import React from "react"
import Date from '../../../components/date'
import Error from 'next/error'
import utilStyles from '../../../styles/utils.module.css'

import { GetServerSideProps } from 'next'
import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  useColorMode,
} from "@chakra-ui/react"
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { useRouter } from "next/router"
import { useState } from 'react'
import { ContextualHref, NFTData, SoundListData } from '../../../interfaces/interfaces'
import { useContextualRouting } from '../../../contextual-modal/contextual-modal'
import Head from "next/head"
import Layout from "../../../components/layout"
import SoundNFT from "../../../components/SoundNFT"
import SoundNFTPreviewSmall from "../../../components/SoundNFTPreviewSmall"
 
export default function SoundList({ errorCode, data }: {
    errorCode: number
    data: SoundListData
    
})
{
  const router = useRouter();
  const { makeContextualHref, returnHref }: ContextualHref = useContextualRouting()
  const [ collection, changeCollection ] = useState<String>("all")

  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
 

  const loadNewPage = async () => {
      if(data.last) return

      data.page += 1

      const res: SoundListData = JSON.parse((await fetch("/api/sounds/" + collection + "/" + String(data.page))).json.toString())

      data.last = res.last

      data.nfts = data.nfts.concat(res.nfts)
  }


  if (errorCode !== null) {
    return <Error statusCode={errorCode} title="Something is wrong."/>
  }
  else {}
  return (
    <Layout>
      <Head>
        <title>First Post</title>
      </Head>
   <Flex
      display="column"
      align="center"
      minH="60vh"
      mb={12}
    >
      <Heading
        as="h2"
        size="xl"
        fontWeight="normal"
        textAlign="center"
        display="block"
        my={8}
      >
        Sounds
      </Heading> 
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
            //<Box className={utilStyles.card} key={nftsound.tokenName} borderRadius="2xl" padding={5} borderWidth="1px" display={{ base: "block", md: "inline-block" }}
            // w={["80vw", "40vw", "25vw"]} height="60vh" margin="auto" onClick={ () => openModal(nftsound.tokenName) } cursor="pointer"
            // bgColor={isDark ? ("gray.800") : ("red.50")} > 
            //</Box>
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
    const { query } = context.query

    const { collection } = context.query
    const { page } = context.query

    let data: SoundListData

    if (errorCode === null) {
        data = JSON.parse((await fetch("/api/sounds/all/1")).json.toString()) 
        if(data == null) {
            data = {
                last: true,
                collection: "all",
                page: 1,
                nfts: []
            }
        }
    }
    else {
        data = {
            last: true,
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
 