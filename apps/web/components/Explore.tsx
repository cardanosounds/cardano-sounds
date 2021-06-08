import React, { MouseEventHandler } from "react"
import { Flex, Text, Spacer, IconButton, Button, Heading, useColorMode } from "@chakra-ui/react"
import {  Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverHeader } from "@chakra-ui/react"
import { InfoIcon, QuestionIcon } from "@chakra-ui/icons"
import Logo from "./Logo"
import NextChakraLink from "./NextChakraLink"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'



export default function Explore({ goBackFunc } : { goBackFunc : Function }) {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    return (
        <>
            <Flex w="100%" direction={{ base: "column", md: "row" }}>
                
                <Flex 
                    direction="column" 
                    w={["80vw", "80vw", "46vw", "46vw", "45vw", "45vw"]} 
                    fontSize={["0.625rem", "0.75rem", "0.8rem", "0.9rem", "1.25rem", "1.75rem"]} 
                    textAlign="left" 
                    minH={["20vh", "20vh", "50vh"]}
                    mb={["0vh", "0vh", "0vh", "0vh", "5vh"]}
                    mt={["25vh", "25vh", "15vh", "unset"]}
                >
                  <Flex>
                    <Text>
                      WE ARE BRINGING AUDIO NFTS CREATED BY YOU / YOUR TRANSACTION
                    </Text>
                  </Flex>
                  <Spacer/>
                  <Text>
                    WHEN WE RECEIVE TRANSACTION, MUSIC CLIP IS ALGORITHMICALLY PUT TOGETHER WITH OUR ORIGINAL SOUNDS, MINTED AND SENT TO YOU
                  </Text>
                  <Spacer/>
                  <Text>
                    WHICH MAKES EACH TRACK UNIQUE AND YOURS
                  </Text>
                  <Spacer/> 
                </Flex>
                <Spacer/>
                <Flex direction="column" mt={["unset", "2.5vh", "unset"]} w={{ base: "80vw", md: "20vw" }} textColor="gray.600">
                  <Popover>
                    <PopoverTrigger>
                      <IconButton variant="ghost" 
                        className={utilStyles.shadow}
                        width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                        height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                        size="lg" 
                        aria-label="Sale purpouse" 
                        pos={[ "inherit", "inherit", "absolute" ]}
                        left={["2vw", "2vw", "12vw", "12vw", "12vw", "12vw"]}
                        bottom={["10vh", "10vh", "15vh", "15vh", "15vh", "15vh"]}
                        color="gray.600"
                        icon={<InfoIcon />}/>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                        <PopoverHeader><Logo size="2em" color={ isDark ? "gray.50" : "gray.900" }/></PopoverHeader>
                      <PopoverBody><Text fontSize={["0.8em", "0.85em", "1em" ]}> By getting our NFT you are supporting development of Cardano Sounds platform</Text></PopoverBody>
                    </PopoverContent>
                  </Popover>
                  <NextChakraLink href="/buy">
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
                    >
                      {/* chakra color var doesn't work here */}
                      <FaChevronRight fill="#4A5568" />
                      <Heading as="h4" fontSize="1.5rem" textColor="gray.600"
                        fontWeight="normal"
                      >
                        BUY
                      </Heading>  
                    </Button>
                  </NextChakraLink>
                  <Spacer/>
                  <NextChakraLink href="/">
                    <Button 
                      width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                      mt={["1vh", "1vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= {["inherit", "inherit", "absolute"]}
                      right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      bottom={["32vh", "32vh", "47vh", "47vh", "47vh", "47vh"]}
                      transition="all 0.3s ease-in-out"
                    >
                      {/* chakra color var doesn't work here */}
                      <FaChevronRight fill="#4A5568" />
                      <Heading as="h4" fontSize="1.5rem" textColor="gray.600"
                        fontWeight="normal"
                      >
                        ABOUT
                      </Heading>  
                    </Button>
                  </NextChakraLink>
                  <Spacer/>
                  <NextChakraLink href="/">
                    <Button 
                      width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                      mt={["1vh", "1vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= {["inherit", "inherit", "absolute"]}
                      right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      bottom={["21vh", "21vh", "31vh", "31vh", "31vh", "31vh"]}
                      transition="all 0.3s ease-in-out"
                    >
                      {/* chakra color var doesn't work here */}
                      <FaChevronRight fill="#4A5568"/>
                        <Heading fontSize="1.5rem" as="h4" textColor="gray.600"
                            fontWeight="normal"
                        >
                            NFTS
                        </Heading>  
                    </Button>
                  </NextChakraLink>
                  <Spacer/>
                  <NextChakraLink href="/">
                    <Button 
                      width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                      mt={["1vh", "1vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= {["inherit", "inherit", "absolute"]}
                      right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      bottom={["21vh", "21vh", "31vh", "31vh", "31vh", "31vh"]}
                      transition="all 0.3s ease-in-out"
                      display={["flex", "flex", "none"]}
                      onClick={ goBackFunc as MouseEventHandler<HTMLButtonElement>}
                    >
                      {/* chakra color var doesn't work here */}
                      <FaChevronLeft fill="#4A5568"/>
                        <Heading fontSize="1.5rem" as="h4" textColor="gray.600"
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