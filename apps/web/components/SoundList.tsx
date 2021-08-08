import React from "react"
import utilStyles from '../styles/utils.module.css'
import Date from './date'
import { GetServerSideProps } from 'next'

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

export default function SoundList({
  page,  
  allSoundsData,
  openModal
}: {
  page: number,   
  allSoundsData: {
    date: string
    title: string
    image: string
    id: string
  }[],
  openModal: (id: string) => void
}) {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  
  return (
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
          // display="flex"
          align-items="center"
          justify-content="center"
          overflow-x="auto"
          columns={[1,2,2,3]}
        >
          {allSoundsData.map(({ id, date, title, image }) => (
             <Box className={utilStyles.card} key={id} borderRadius="2xl" padding={5} borderWidth="1px" display={{ base: "block", md: "inline-block" }}
             w={["80vw", "40vw", "25vw"]} height="60vh" margin="auto" onClick={ () => openModal(id) } cursor="pointer"
             bgColor={isDark ? ("gray.800") : ("white")} > 
               <Flex justify="center" display="column">
 
                  <Heading as="h3" size="md">{title}</Heading>
                  <img src={image} />
                  <Date dateString={date}/>
                </Flex>
              </Box>
          ))}
        </SimpleGrid>
      </Flex>
    </Flex>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // ...
  context.query
  const res = await fetch(`https://.../data`)
  const data: any = await res.json()

  return {
    props: {
      data,
    },
  }
}
 