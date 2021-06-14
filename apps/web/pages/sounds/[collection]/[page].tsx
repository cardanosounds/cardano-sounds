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
import { getSoundsNFTData } from '../../../lib/sounds'
import Head from "next/head"
import Layout from "../../../components/layout"
import SoundNFT from "../../../components/SoundNFT"
 
export default function SoundList({ errorCode, data }: {
    errorCode: number
    data: SoundListData
    
})
{
  const router = useRouter();
  const { makeContextualHref, returnHref }: ContextualHref = useContextualRouting()

  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  const [openedModal, changeModalState] = useState<boolean>(false);
  
  
  const openModal = (id: string) => {
      {/*fetchCollection(id)
      router.push(
          makeContextualHref({ id: id }),
          `/collections/${id}`,
          {
          shallow: true,
          }
        );*/}
      changeModalState(true)
  }
  const closeModal = () => {
      //router.push(returnHref, "/", { shallow: true });
      window.history.pushState({}, document.title, 
        "/sounds/" + data.collection + "/" + data.page);
      changeModalState(false)
  }

  const loadNewPage = async () => {
      if(data.last) return

      data.page += 1

      const res = await getSoundsNFTData(data.collection.toString(), data.page)

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
    <Modal size="xl" isOpen={openedModal} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>

            <>

            </>


          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
    </Modal>
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
            <Box className={utilStyles.card} key={nftsound.tokenName} borderRadius="2xl" padding={5} borderWidth="1px" display={{ base: "block", md: "inline-block" }}
             w={["80vw", "40vw", "25vw"]} height="60vh" margin="auto" onClick={ () => openModal(nftsound.tokenName) } cursor="pointer"
             bgColor={isDark ? ("gray.800") : ("white")} > 
              <SoundNFT soundNFTData={nftsound}/>
            </Box>
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
        data = await getSoundsNFTData(collection.toString(), page as unknown as number)
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
 