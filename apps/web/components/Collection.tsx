import React from "react"
import { useContextualRouting } from '../contextual-modal/contextual-modal'
import NextChakraLink from './NextChakraLink'
import utilStyles from '../styles/utils.module.css'
import Date from './date'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  useColorMode
} from "@chakra-ui/react"
import { GetStaticProps } from "next"
import { getCollectionData } from "../lib/collections"
import { CollectionData } from "../interfaces/interfaces"
interface ContextualHref {
  makeContextualHref: (extraQueryParams: { [key: string]: any }) => string
  returnHref: string
  
}

export default function Collection(collectionData: CollectionData) {
    
    return (
        <>
            <Flex
            align="center"
            justify="center"
            // // justify={{ base: "center", md: "space-around", xl: "space-between" }}
            // // direction={{ base: "column-reverse", md: "row" }}
            direction="column"
            minH="70vh"
            px={{ base: 0, md: 6 }}
            //mb={16}
            >

                <Box w="100%" mt={{ base: 4, md: 0 }} align="center" >
                  <Image src={collectionData.image} size="100%" rounded="1rem" shadow="2xl" />
                </Box>
                <Stack
                  spacing={4}
                  // w={{ base: "90%", md: "90%" }}
                  w="90%"
                  align="center"
                >
                  <h1 className={utilStyles.headingLg}>{collectionData.title}</h1>
                  <div className={utilStyles.lightText}>
                    <Text> {collectionData.date}
                     </Text>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: collectionData.contentHtml }} />
                </Stack> 

            </Flex>
        </>
    )
}
