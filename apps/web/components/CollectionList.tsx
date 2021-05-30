import React from "react"
import utilStyles from '../styles/utils.module.css'
import Date from './date'

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
 
export default function CollectionList({
  allCollectionsData,
  openModal
}: {
  allCollectionsData: {
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
      minH="90vh"
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
        Collections
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
          //display={{ base: "column", md: "flex" }}

        >
          {allCollectionsData.map(({ id, date, title, image }) => (
             <Box className={utilStyles.card} key={id} borderRadius="2xl" padding={5} borderWidth="1px" display={{ base: "block", md: "inline-block" }}
             w={["80vw", "40vw", "25vw"]} height="60vh" margin="auto" onClick={ () => openModal(id) } cursor="pointer"
             bgColor={isDark ? ("gray.800") : ("white")} > 
               <Flex justify="center" display="column">
 
                  {/*<NextChakraLink w="60%" margin="auto" //href={`/collections/${id}`} 
                    href={makeContextualHref({ id: id })}
                    as={`/collections/${id}`}
                  >*/}
                    <Heading as="h3" size="md">{title}</Heading>
                  {/*</NextChakraLink>*/}
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
 