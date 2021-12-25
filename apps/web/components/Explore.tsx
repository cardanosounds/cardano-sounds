import React, { useEffect, useState } from "react"
import { Flex, Spacer, Button, Heading, List, ListItem, ListIcon } from "@chakra-ui/react"
import NextChakraLink from "./NextChakraLink"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'
import GlitchText from "./GlitchText"
import { GiTakeMyMoney, GiArtificialIntelligence } from "react-icons/gi"
import { SiAudiomack } from "react-icons/si"

export default function Explore({ goBackFunc, soundFunc } : { goBackFunc : Function, soundFunc : Function  }) {
    const [ glitching, setGlitching ]= useState<boolean>(true)

    useEffect(() => { 
      setTimeout(() => setGlitching(false), 225);
    }, [])
  
    const glitchingText = (text: string, glitching: boolean) => {
      if(glitching) return <GlitchText>{text}</GlitchText>
  
      return <>{text}</>
    }

    return (
        <>
            <Flex w="100%" direction={{ base: "column", md: "row" }}>
                <Flex 
                    direction="column" 
                    w={["75vw", "75vw", "46vw", "46vw", "45vw", "45vw"]} 
                    fontSize={["0.825rem", "0.9rem", "0.9rem", "0.9rem", "1.25rem", "1.75rem"]} 
                    textAlign="left" 
                    minH={["40vh", "30vh", "50vh"]}
                    mb={["0vh", "0vh", "0vh", "0vh", "5vh"]}
                    mt={["20vh", "20vh", "15vh", "15vh"]}
                >
                  <Flex>
                  <Heading as="h2"
                      transition="all 0.2s ease-in-out"
                      >{glitchingText('Creating the safe space for AUDIO and NFTs', glitching)}</Heading>
                  </Flex>
                  <Spacer/>
                  <List spacing={3} m={8}>
                    <ListItem>
                     <Heading as="h2"
                      transition="all 0.33s ease-in-out"
                      > CREATE <ListIcon as={GiArtificialIntelligence} /></Heading>
                    </ListItem>
                    <ListItem>
                      <Heading as="h2"
                      transition="all 0.45s ease-in-out"
                      >& EARN <ListIcon as={GiTakeMyMoney}/></Heading>
                    </ListItem>  
                  </List>
                  <Spacer/>
                  <List spacing={3}>
                    <ListItem>
                      <Heading as="h2"
                      transition="all 0.6s ease-in-out"
                      >..with sound <ListIcon as={SiAudiomack}/></Heading>
                    </ListItem>
                  </List>
                  <Spacer/>
                </Flex>
                <Spacer/>
                <Flex direction="column" mt={["unset", "2.5vh", "unset"]} w={{ base: "80vw", md: "20vw" }}>
                  <NextChakraLink 
                    onClick={() => soundFunc()}
                    href="/prebuy"
                  >
                    <Button 
                      width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                      mt={["1vh", "1vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= {["inherit", "inherit", "absolute"]}
                      right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      bottom={["43vh", "43vh", "63vh", "63vh", "63vh", "63vh"]}                      
                      transition="all 0.3s ease-in-out"
                      onClick={() => soundFunc}
                      justifyContent={["flex-start", "flex-start", "center"]}
                    >
                      BUY
                      <FaChevronRight />
                    </Button>
                  </NextChakraLink>
                  <Spacer/>
                  <NextChakraLink 
                    onClick={() => soundFunc()}
                    href="/create"
                  >
                    <Button 
                      width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                      mt={["1vh", "1vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      position= {["inherit", "inherit", "absolute"]}
                      right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      bottom={["32vh", "32vh", "47vh", "47vh", "47vh", "47vh"]}
                      variant="ghost"
                      className={utilStyles.shadow}
                      transition="all 0.3s ease-in-out"
                      justifyContent={["flex-start", "flex-start", "center"]}
                    >
                      CREATE
                      <FaChevronRight  />
                    </Button>
                  </NextChakraLink>
                  <Spacer/>
                  <NextChakraLink 
                    href="/"
                  >
                    <Button 
                      width="70vw"
                      mt={["1vh", "1vh"]}
                      height={["8vh", "7vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      transition="all 0.3s ease-in-out"
                      display={["flex", "flex", "none"]}
                      justifyContent={["flex-start", "flex-start", "center"]}
                      onClick={() => {
                        soundFunc()
                        goBackFunc()
                      }}
                    > 
                        BACK
                      <FaChevronLeft />
                    </Button>
                  </NextChakraLink>
                  <Spacer />
                </Flex>
            </Flex>
        </>
    )
}