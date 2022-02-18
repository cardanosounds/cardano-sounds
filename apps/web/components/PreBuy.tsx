import React, { useEffect, useState } from "react"
import { Button, List, ListIcon, ListItem, Stack, Spacer, Tooltip, Flex, Text} from "@chakra-ui/react"
import utilStyles from "../styles/utils.module.css"
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import { InfoIcon } from "@chakra-ui/icons";
import NextChakraLink from "./NextChakraLink";
import useSound from "use-sound";
import { GetServerSideProps } from 'next'
import Countdown from "react-countdown"


export default function PreBuy(data) {//: {status: string, datetime: Date}) {
    const [isTooltipOpen, setIsTooltipOpen] = useState<boolean>(false)
    
    const playSound = (id: string) => {
        if(window.localStorage.getItem('sound') === 'false') return
        play({id: id})
      }
  
    const [play, { stop }] = useSound("/sounds/landingSprite.mp3", {
        sprite: {
          futuristicbasshit: [0, 2750],
          drumbasshit: [4000, 1529.6825396825398],
          shortbasshit: [7000, 1100.498866213151],
          click: [10000, 199.47845804988697],
          lightswitch: [12000, 166.66666666666606],
          negativetoneui: [14000, 1254.6712018140588],
          retrogamenotif: [17000, 1466.666666666665],
          sweep: [20000,781.3832199546482]
        }
      })
    return(
        <>
            <Stack
                spacing={6}
                align="center"
                margin="auto"
                maxW={["80vw", "80vw", "75vw", "70vw", "75vw", "70vw"]}
                mt={["25vh", "25vh", "30vh", "30vh", "25vh", "25vh"]}
            >
                <Text fontWeight="bold" fontSize="36" my={4}>Support us by minting our CNFTs</Text>

                <List spacing={3} pl="3vw" ml="0" marginInlineEnd="auto" mt="5vh" >
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            The collection is being released in 3 <strong>short</strong> waves
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            When time is set, an address with QR code and price will be displayed here
                            <Tooltip 
                                isOpen={isTooltipOpen}
                                label="To not miss out, follow our socials" 
                                fontSize="md"
                            >
                                <InfoIcon
                                    ml="2vw"
                                    onMouseEnter={() => setIsTooltipOpen(true)}
                                    onMouseLeave={() => setIsTooltipOpen(false)}
                                    onClick={() => setIsTooltipOpen(true)}
                                />
                            </Tooltip>
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            Never use exchange wallet to buy NFT! You will be able to mint 5 per TX
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            Music clip and website with animated player are created for each tx
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            All supporters will also get Cardano Sounds Community Token (CSCT)
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            You will be able to check live status of the generative and minting process by transaction ID
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        <ListIcon as={FaChevronRight} color="green.500" />
                            You can browse already minted CNFTs from the collection <NextChakraLink href='/sounds/all'>here</NextChakraLink>
                    </ListItem>
                </List>
                <Flex direction={["column", "column", "row", "row"]} w={["100%", "100%", "100%", "100%", "100%", "90%"]}>
                    <NextChakraLink
                        onClick={() => playSound("click")}
                        href="/"
                    >
                        <Button 
                            width={["80vw", "80vw", "25vw", "25vw", "25vw", "25vw" ]}
                            mt={["1vh", "1vh", "5vh"]}
                            height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                            variant="ghost"
                            className={utilStyles.shadow}
                            transition="all 0.3s ease-in-out"
                            justifyContent={["flex-start", "flex-start", "center"]}
                        >
                            {/* chakra color var doesn't work here */}
                            {/* <Heading className={utilStyles.noHovDecor} as="h4" fontSize="1.5rem"
                            fontWeight="normal"
                            > */}
                            HOME
                            <FaChevronLeft />
                            {/* </Heading>   */}
                        </Button>
                    </NextChakraLink>
                    <Spacer/>
                    {/* <NextChakraLink href="/buy"> */}
                    <Flex
                     width={["80vw", "80vw", "25vw", "25vw", "25vw", "25vw" ]}
                     mt={["1vh", "1vh", "5vh"]}
                     height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                     variant="ghost"
                     className={utilStyles.shadow}
                     transition="all 0.3s ease-in-out"
                     justifyContent={["flex-start", "flex-start", "center"]}
                    >
                    {/* <Countdown date={new Date("2022-02-24 20:00:00 GMT+0100")}> */}
                    <Countdown date={new Date(data.data.datetime)}>
                        <NextChakraLink 
                            // width={["80vw", "80vw", "25vw", "25vw", "25vw", "25vw" ]}
                            // mt={["1vh", "1vh", "5vh"]}
                            // height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                            // variant="ghost"
                            // className={utilStyles.shadow}
                            // transition="all 0.3s ease-in-out"
                            // justifyContent={["flex-start", "flex-start", "center"]}
                            href="/buy"
                        ><Button width="100%" h="100%">BUY<FaChevronRight /></Button>
                            {/* chakra color var doesn't work here */}
                            {/* <Heading fontSize="1.5rem" as="h4"
                                fontWeight="normal"
                            > */}
                                
                                
                            
                            {/* </Heading>   */}
                        </NextChakraLink>
                    </Countdown>
                    </Flex>
                    
                </Flex>
            </Stack>    
        </>
    )
}
