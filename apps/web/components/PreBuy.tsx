import React from "react"
import { Button, Heading, List, ListIcon, ListItem, Stack, Spacer, Tooltip, Flex } from "@chakra-ui/react"
import Head from "next/head"
import Layout from "./layout"
import utilStyles from "../styles/utils.module.css"
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { InfoIcon } from "@chakra-ui/icons";
import NextChakraLink from "./NextChakraLink";

export default function PreBuy() {

    return(
        <>
            <Stack
                spacing={6}
                align="center"
                margin="auto"
                maxW={["80vw", "80vw", "75vw", "70vw", "75vw", "70vw"]}
                mt="25vh"
            >
                <Heading
                    as="h1"
                    size="xl"
                    textAlign={["left", "left", "left", "left", "center", "center"]}
                >
                    How to get one of the first Cardano Sounds NFTs?
                </Heading>
                    <List spacing={3} mt="5vh">
                        <ListItem>
                            <ListIcon as={FaChevronRight} color="green.500" />
                                Our collection will be released in 3 short waves
                        </ListItem>
                        <ListItem>
                            <ListIcon as={FaChevronRight} color="green.500" />
                                After we test our solution on testnet, we will announce date/time of the first sale <Tooltip label="To not miss out, follow our socials" fontSize="md"><InfoIcon /></Tooltip>
                        </ListItem>
                        <ListItem>
                            <ListIcon as={FaChevronRight} color="green.500" />
                                When time is set, an address with QR code and price will be displayed here
                        </ListItem>
                        <ListItem>
                            <ListIcon as={FaChevronRight} color="green.500" />
                                Never use exchange wallet to buy NFT
                        </ListItem>
                        <ListItem>
                            <ListIcon as={FaChevronRight} color="green.500" />
                                To buy multiple NFTs, use multiple transactions
                        </ListItem>
                        <ListItem>
                            <ListIcon as={FaChevronRight} color="green.500" />
                               You will be able to check live status of the sound generation and minting process by transaction ID
                        </ListItem>
                    </List>
                    <Flex direction={["column", "column", "row", "row"]} w={["100%", "100%", "90%", "80%"]}>
                        <NextChakraLink href="/">
                            <Button 
                              width={["70vw", "70vw", "25vw", "25vw", "25vw", "25vw" ]}
                              mt={["1vh", "1vh", "5vh"]}
                              height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]} 
                              variant="ghost"
                              className={utilStyles.shadow}
                              transition="all 0.3s ease-in-out"
                            >
                              {/* chakra color var doesn't work here */}
                              <FaChevronLeft fill="#4A5568" />
                              <Heading as="h4" fontSize="1.5rem" textColor="gray.600"
                                fontWeight="normal"
                              >
                                HOME
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
                              transition="all 0.3s ease-in-out"
                            >
                              {/* chakra color var doesn't work here */}
                              <FaChevronRight fill="#4A5568"/>
                                <Heading fontSize="1.5rem" as="h4" textColor="gray.600"
                                    fontWeight="normal"
                                >
                                    ABOUT
                                </Heading>  
                            </Button>
                        </NextChakraLink>
                    </Flex>
            </Stack>    
        </>
    )
}