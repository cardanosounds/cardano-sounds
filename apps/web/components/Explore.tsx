import React from "react"
import { Flex, Text, Spacer, IconButton, Button, Heading, useColorMode } from "@chakra-ui/react"
import {  Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverHeader } from "@chakra-ui/react"
import { QuestionIcon } from "@chakra-ui/icons"
import Logo from "./Logo"
import NextChakraLink from "./NextChakraLink"
import { FaChevronRight } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'



export default function Explore() {
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'

    return (
        <>
            <Flex w="100%" direction="row">
                
                <Flex direction="column" w="45vw" fontSize="1.75rem" textAlign="left" minH="50vh" mb="5vh">
                  <Flex>
                    <Text size="lg">
                      WE ARE BRINGING AUDIO NFTS CREATED BY YOU / YOUR TRANSACTION
                    </Text>
                   
                  </Flex>
                  <Spacer/>
                  <Text size="xl">
                    TRACKS ARE ALGORITHMICALLY PUT TOGETHER WITH OUR ORIGINAL SOUNDS
                  </Text>
                  <Spacer/>
                  <Text size="2xl">
                    WHICH MAKES EACH TRACK UNIQUE AND YOURS
                  </Text>
                  <Spacer/> 
                  <Popover>
                    <PopoverTrigger>
                      <IconButton variant="ghost" 
                        className={utilStyles.shadow}
                        width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                        height={["17vh", "15vh", "15vh", "15vh", "15vh", "15vh"]}
                        size="lg" 
                        aria-label="Sale purpouse" 
                        pos="absolute"
                        left={["2vw", "2vw", "12vw", "12vw", "12vw", "12vw"]}
                        bottom={["10vh", "10vh", "15vh", "15vh", "15vh", "15vh"]}
                        color="gray.600"
                        icon={<QuestionIcon />}/>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                        <PopoverHeader><Logo size="2em" color={ isDark ? "gray.50" : "gray.900" }/></PopoverHeader>
                      <PopoverBody><Text fontSize="1rem"> By getting our NFT you are supporting development of Cardano Sounds platform</Text></PopoverBody>
                    </PopoverContent>
                  </Popover>
                </Flex>
                {/*<Spacer/>*/}
                <Flex direction="column" w="20vw" textColor="gray.600">
                  <NextChakraLink href="/">
                    <Button 
                      width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                      mt={["4vh", "4vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= "absolute"//{["inherit", "absolute", "absolute", "absolute"]}
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
                      mt={["4vh", "4vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= "absolute"//{["inherit", "absolute", "absolute", "absolute"]}
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
                      mt={["4vh", "4vh", "5vh"]}
                      height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                      variant="ghost"
                      className={utilStyles.shadow}
                      position= "absolute"//{["inherit", "absolute", "absolute", "absolute"]}
                      right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                      bottom={["21vh", "21vh", "31vh", "31vh", "31vh", "31vh"]}
                      transition="all 0.3s ease-in-out"
                    >
                      {/* chakra color var doesn't work here */}
                      <FaChevronRight fill="#4A5568"/>
                        <Heading fontSize="1.5rem" as="h4" textColor="gray.600"
                            fontWeight="normal"
                        >
                            COLLECTIONS
                        </Heading>  
                    </Button>
                  </NextChakraLink>
                  <Spacer/>
                </Flex>
            </Flex>
        </>
    )
}