import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getSortedCollectionsData } from '../lib/collections'
// import Link from 'next/link'
import Date from '../components/date'
import { GetStaticProps } from 'next'

import { Flex, Stack, Heading, Button, useColorModeValue, Box, SimpleGrid, Text } from '@chakra-ui/react'
import Hero from '../components/Hero'
import CollectionList from '../components/CollectionList'
import ContactUs from '../components/ContactUs'
import Footer from '../components/Footer'
import NextChakraLink from '../components/NextChakraLink'
import Collection from '../components/Collection'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react"
import { CollectionData, ContextualHref } from '../interfaces/interfaces'
import { useContextualRouting } from '../contextual-modal/contextual-modal'
// import { PageTransition } from 'next-page-transitions'

export default function Home({
  allCollectionsData
}: {
  allCollectionsData: {
    date: string
    title: string
    id: string
    image: string
  }[]
}) {
  const color = useColorModeValue("gray.50", "gray.900")

   const router = useRouter();
   const { makeContextualHref, returnHref }: ContextualHref = useContextualRouting()
   
   const [collectionData, changeCollection] = useState<CollectionData>();
   const [openedModal, changeModalState] = useState<boolean>(false);
  
   const fetchCollection = async (id: string) => {
      //changeCollection(getCollectionData(id.id))
      const res = await fetch(`/api/collections/${id}`)
      const data = await res.json() as CollectionData
      changeCollection(data)
    }

   const openModal = (id: string) => {
       fetchCollection(id)
       router.push(
           makeContextualHref({ id: id }),
           `/collections/${id}`,
           {
           shallow: true,
           }
       );
       changeModalState(true)
   }
   const closeModal = () => {
       router.push(returnHref, "/", { shallow: true });
       changeModalState(false)
   }
   return (
    <>
       <Modal size="xl" isOpen={openedModal} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Collection {...collectionData}/>
          </ModalBody>
          <ModalFooter>
            <Button onClick={closeModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Stack 
      as="main"
      align="center" 
      >
        <Flex 
          flexDirection="column"
        >
          <Layout home>
            <Head>
              <title>{siteTitle}</title>
            </Head>
            <Hero></Hero>
            {/*<Flex 
              justify="center"
              id="collections" 
              bgColor={color}
            >
              <CollectionList allCollectionsData={allCollectionsData} openModal={ openModal }/> 
            </Flex>
            <Flex 
            justify="center"
            id="contact" 
            >
              <ContactUs />
            </Flex>*/}
          </Layout>
        </Flex>
      </Stack>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const allCollectionsData = getSortedCollectionsData()
  return {
    props: {
      allCollectionsData
    }
  }
}