import React, { useState } from "react"
import { Button, Heading, Stack, Text, Image, Flex, Box
       , InputGroup, Input, InputRightElement, List, ListItem
       , ListIcon, Spacer, Modal, ModalOverlay, ModalContent
       , ModalHeader, ModalBody, ModalFooter, useDisclosure, ModalCloseButton 
} from "@chakra-ui/react"
import utilStyles from "../styles/utils.module.css"
import { IoIosWallet, IoMdPricetag } from 'react-icons/io';
import { FaChevronLeft } from 'react-icons/fa'
import { RiAlarmWarningFill } from 'react-icons/ri'
import { CopyIcon, InfoIcon, SearchIcon } from "@chakra-ui/icons";
import NextChakraLink from "./NextChakraLink";
import Transaction from "./Transaction";
import { useToast } from "@chakra-ui/react"
import Address from "./Address";

export default function Buy(){
    const [ searchValue, handleSearchValChange] = useState<string>("")
    const [ isSearchInValid, invalidateSearchString] = useState<boolean>(true)
    const [ mobileTxSearch, showMobileTxSearch] = useState<boolean>(false)
    const [ mobileAddress, showMobileAddress] = useState<boolean>(false)
    const [ txStatus, showTxStatus ] = useState<boolean>(false)

     const { isOpen, onOpen, onClose } = useDisclosure()

    const toast = useToast()

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => handleSearchValChange(event.target.value)

    const search = () => {
        if(searchValue.length < 5){
            invalidateSearchString(true)
        }
        else {

            invalidateSearchString(false)
            showTxStatus(true)
        }
    }

    return(
        <>
            <Flex
                align="center"
                margin="auto"
                maxW="80vw"
                mt={["25vh", "25vh", "25vh", "25vh", "20vh", "20vh"]}
                direction="column"
                minH="60vh"
            >   
                <Heading
                    as="h1"
                    size="xl"
                    textAlign={["left", "left", "left", "left", "center", "center"]}
                    w="100%"
                    mb={["unset", "unset", "5vh"]}
                >
                    BUY CARDANO SOUNDS NFT
                </Heading>
                <Stack spacing={9} w={["100%", "100%", "70vw"]} direction={["column", "column", "row"]}>
                    
                    <InputGroup 
                        mt={["5vh", "5vh", "unset"]}
                        display={mobileTxSearch ? "display" : ["none", "none", "display"]}
                    >
                        <Input 
                            placeholder="Check status for txid" 
                            id="searchInput"
                            isInvalid={isSearchInValid}
                            value={searchValue}
                            onChange={ handleChange }
                        />
                        <InputRightElement onClick={ search } children={<SearchIcon color="gray.600" />} />
                    </InputGroup>
                    
                    <Flex direction="column"> 
                        {txStatus ? 
                        <Transaction id={searchValue} />
                        : mobileTxSearch ? <></> :
                        <>  
                            <List spacing={9} ml="0" marginInlineEnd="auto" mt={["3vh", "2vh", "5vh"]} >
                                <ListItem>
                                    <ListIcon as={IoMdPricetag} color="yellow.400" />
                                        Price 50ADA
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={RiAlarmWarningFill} color="red.400" />
                                        Use Yoroi or Daedalus, do not send ADA from an exchange! Send the exact amount without additional tokens.
                                </ListItem>
                                <ListItem>
                                    <ListIcon as={InfoIcon} color="teal.400" />
                                        If you want to buy more NFTs, send multiple transactions with 50ADA. 
                                </ListItem>
                                <Spacer/>
                            </List>
                        </>
                        }
                        <Button 
                           width={["80vw", "80vw", "25vw", "25vw", "25vw", "25vw" ]}
                           mt={["1vh", "1vh", "5vh"]}
                           height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                           variant="ghost"
                           className={utilStyles.shadow}
                           transition="all 0.3s ease-in-out"
                           display={mobileTxSearch ? "none" : "flex"}
                           onClick={ () => showMobileTxSearch(true) }
                        >
                           <SearchIcon color="gray.600"/>
                           <Heading fontSize={["1.25rem", "1.25rem", "1.5rem"]} as="h4" textColor="gray.600"
                               fontWeight="normal"
                           >
                               LOOKUP TX
                           </Heading>  
                        </Button>
                        <Button 
                           width={["80vw", "80vw", null]}
                           mt={["1vh", "1vh", null]}
                           height={["8vh", "7vh", null]}
                           variant="ghost"
                           className={utilStyles.shadow}
                           transition="all 0.3s ease-in-out"
                           display={mobileTxSearch ? "none" : ["flex", "flex", "none"]}
                           onClick={onOpen}
                        >
                            <IoIosWallet fill="#4A5568"/>
                            <Heading fontSize={["1.25rem", "1.25rem", "1.5rem"]} as="h4" textColor="gray.600"
                                fontWeight="normal"
                            >
                                ADDRESS
                            </Heading>  
                        </Button>
                        
                        <Button 
                           width={["80vw", "80vw", null]}
                           mt={["1vh", "1vh", null]}
                           height={["8vh", "7vh", null]}
                           variant="ghost"
                           className={utilStyles.shadow}
                           transition="all 0.3s ease-in-out"
                           display={txStatus ? "flex" : "none"}
                           onClick={ () => showTxStatus(false) }
                        >
                           <SearchIcon color="gray.600"/>
                           <Heading fontSize="1.5rem" as="h4" textColor="gray.600"
                               fontWeight="normal"
                           >
                               LOOKUP ANOTHER
                           </Heading>  
                        </Button>
                        <NextChakraLink href="/buy">
                            <Button 
                                width={["80vw", "80vw", "25vw", "25vw", "25vw", "25vw"]}
                                mt={["1vh", "1vh", "5vh"]}
                                height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                                variant="ghost"
                                display={mobileTxSearch ? "flex" : ["none", "none", "none"]}
                                className={utilStyles.shadow}
                                transition="all 0.3s ease-in-out"
                                onClick={ () => { 
                                    showMobileTxSearch(!mobileTxSearch) 
                                    showTxStatus(false)
                                }}
                            >
                                {/* chakra color var doesn't work here */}
                                <FaChevronLeft fill="#4A5568" />
                                <Heading className={utilStyles.noHovDecor} as="h4" fontSize="1.5rem" textColor="gray.600"
                                    fontWeight="normal"
                                >
                                    BACK
                                </Heading>  
                            </Button>
                        </NextChakraLink>
                    </Flex>
                    <Address display={mobileAddress ? "flex" : ["none", "none", "flex"]} />
                </Stack>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Cardano address</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Address/>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            Close
                        </Button>
                        {/*<Button variant="ghost">Secondary Action</Button>*/}
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}