import React, { MouseEventHandler } from "react"
import { Flex, Text, Spacer, IconButton, Button, Heading, useColorMode, List, ListItem, ListIcon, Grid } from "@chakra-ui/react"
import {  Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverHeader } from "@chakra-ui/react"
import { CheckIcon, EditIcon, QuestionIcon, RepeatIcon, SunIcon } from "@chakra-ui/icons"
import Logo from "./Logo"
import NextChakraLink from "./NextChakraLink"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { GrDocumentSound } from 'react-icons/gr';
import utilStyles from '../styles/utils.module.css'
import { MdCheckCircle } from "react-icons/md"
import { AiOutlineSound } from "react-icons/ai"



export default function Explore({ goBackFunc, soundFunc } : { goBackFunc : Function, soundFunc : Function  }) {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    return (
        <>
            <Flex w="100%" direction={{ base: "column", md: "row" }}>
                
                <Flex 
                    direction="column" 
                    w={["70vw", "70vw", "46vw", "46vw", "45vw", "45vw"]} 
                    fontSize={["0.825rem", "0.9rem", "0.9rem", "0.9rem", "1.25rem", "1.75rem"]} 
                    textAlign="left" 
                    minH={["40vh", "30vh", "50vh"]}
                    mb={["0vh", "0vh", "0vh", "0vh", "5vh"]}
                    mt={["20vh", "20vh", "15vh", "15vh"]}
                >
                  <Flex>
                    <Text>
                     The common place for audio NFTs.
                    </Text>
                  </Flex>
                  <Spacer/>
                  <List spacing={3}>
                    <ListItem>
                      <ListIcon as={EditIcon} color='green.500' />
                      Create
                    </ListItem>
                    <ListItem>
                      <ListIcon as={RepeatIcon} color='green.500' />
                      Use
                    </ListItem>
                    <ListItem>
                      <ListIcon as={CheckIcon} color='green.500' />
                      & Earn
                    </ListItem>  
                  </List>
                  <Spacer/>
                  <List spacing={3}>
                    <ListItem>
                      ..with sound 
                      {/* <ListIcon as={GrDocumentSound} pl={2} width={24} height={24} stroke='#38a169' /> */}
                    </ListItem>
                  </List>
                  {/* <Text display="inline"> */}
                    {/* ...with sound <GrDocumentSound size={48} display="inline"/> */}
                  {/* </Text> */}
                  <Spacer/>
                  {/* <Text>
                    Which makes each CNFT unique and <strong>yours</strong>.
                  </Text>
                  <Spacer/>  */}
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
                    >
                      {/* chakra color var doesn't work here  fill="#4A5568" */}
                      <FaChevronRight />
                      <Heading as="h4" fontSize="1.5rem"
                        fontWeight="normal"
                      >
                        BUY
                      </Heading>  
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
                      // right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      // bottom={["21vh", "21vh", "31vh", "31vh", "31vh", "31vh"]}
                      variant="ghost"
                      className={utilStyles.shadow}
                      transition="all 0.3s ease-in-out"
                    >
                      {/* chakra color var doesn't work here */}
                      <FaChevronRight  />{/* fill="#4A5568" */}
                      <Heading as="h4" fontSize="1.5rem"
                        fontWeight="normal"
                      >
                        CREATE
                      </Heading>  
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
                      onClick={() => {
                        soundFunc()
                        goBackFunc()
                      }}
                    > 
                      {/* chakra color var doesn't work here */}
                      <FaChevronLeft />
                        <Heading fontSize="1.5rem" as="h4"
                            fontWeight="normal"
                        >
                            BACK
                        </Heading>  
                    </Button>
                  </NextChakraLink>
                  <Spacer />
                </Flex>
            </Flex>
        </>
    )
}