import React from "react"
import Date from '../../../components/date'
import Error from 'next/error'
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
      router.push(returnHref, "/", { shallow: true });
      changeModalState(false)
  }
  if (errorCode !== null) {
    return <Error statusCode={errorCode} title="Something is wrong."/>
  }
  else {}
  return (
    <>
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
          {/*allSoundsData.map(({ id, date, title, image }) => (
             <Box className={utilStyles.card} key={id} borderRadius="2xl" padding={5} borderWidth="1px" display={{ base: "block", md: "inline-block" }}
             w={["80vw", "40vw", "25vw"]} height="60vh" margin="auto" onClick={ () => openModal(id) } cursor="pointer"
             bgColor={isDark ? ("gray.800") : ("white")} > 
               <Flex justify="center" display="column">
 
                  <Heading as="h3" size="md">{title}</Heading>
                  <img src={image} />
                  <Date dateString={date}/>
                </Flex>
              </Box>
          ))*/}
        </SimpleGrid>
      </Flex>
    </Flex>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    // ...
    let errorCode: number = null;
    const { query } = context.query

    const qArray: string[] = typeof(query) !== "undefined" ? query as string[] : []
    
    let q: string = "";

    switch(qArray.length) {
        case 0: {
            q = "/"
            break;
        }
        case 1: {
            //only page
            q = `/${qArray[0]}`
            break;
        }
        case 2: {
            //collection/page
            q = `/${qArray[0]}/${qArray[1]}`
            break;
        }
        default: {
            errorCode = 404
            break;
        }
    }

    let data: SoundListData

    if (errorCode === null) {
        data = await getSoundsNFTData(q)
        if(data == null) {
            data = {
                last: true
            }
        }
    }
    else {
        data = {
            last: true
        }
    }
    

    return {
        props: {
          errorCode,
          data
        },
    }
}
 