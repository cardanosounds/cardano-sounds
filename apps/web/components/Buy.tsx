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
import { InfoIcon, SearchIcon } from "@chakra-ui/icons";
import Transaction from "./Transaction";
import Address from "./Address";
import PayBtn from "./PayBtn.jsx";

export default function Buy(data){//: {status: string, address: string, price: number }){
    const [ searchValue, handleSearchValChange] = useState<string>("")
    const [ isSearchInValid, invalidateSearchString] = useState<boolean>(true)
    const [ txSearch, showTxSearch] = useState<boolean>(false)
    const [ mobileAddress, showMobileAddress] = useState<boolean>(false)
    const [ txStatus, showTxStatus ] = useState<boolean>(false)

    const { isOpen, onOpen, onClose } = useDisclosure()

    const handleChange = (event: { target: { value: React.SetStateAction<string>; }; }) => handleSearchValChange(event.target.value)

    const search = (txhash: string = '') => {
        let searchVal
        if(txhash === '') searchVal = searchValue
        else {
            searchVal = txhash
        }
        if(searchVal.length < 5){
            invalidateSearchString(true)
        }
        else {
            invalidateSearchString(false)
            showTxStatus(true)
        }
    }

    const successCallback = (txhash: string) => {
        handleSearchValChange(txhash)
        search(txhash)
        showTxSearch(true) 
    }

    return(
        <>
            <Flex
                align="center"
                margin="auto"
                maxW="80vw"
                mt={["25vh", "25vh", "30vh", "30vh", "20vh", "20vh"]}
                direction="column"
                minH="65vh"
            >   
                <Stack w={["100%", "100%", "100%", "70vw"]} direction={["column", "column", "column", "column", "row"]}>
                    <Flex direction="column"
                        w={["100%", "100%", "100%", "100%", "40vw"]}
                        mr={48}
                    > 
                        <Flex minH="40vh">
                            <InputGroup 
                                w={["100%", "100%", "100%", "100%", "40vw"]}
                                margin="auto"
                                display={txStatus ? "none" : txSearch ? "flex" : "none"}
                            >
                                <Input 
                                    placeholder="Check status for txid" 
                                    id="searchInput"
                                    isInvalid={isSearchInValid}
                                    value={searchValue}
                                    onChange={ handleChange }
                                />
                                <InputRightElement onClick={() => search() } children={<SearchIcon color="gray.600" />} />
                            </InputGroup>
                            {txStatus ? 
                            <Flex minH={["50vh", "50vh", "40vh"]}
                            >
                                <Transaction id={searchValue}/>
                            </Flex>
                            : txSearch ? <></> :
                            <>  
                                <List marginInlineEnd="auto" my="auto" w={["80vw","80vw", "80vw", "80vw", "45vw"]}>
                                    <ListItem mb={9}>
                                        <ListIcon as={IoMdPricetag} />{/* color="yellow.400" */}
                                            Price {data.data.price}ADA
                                    </ListItem>
                                    <ListItem mb={9}>
                                        <ListIcon as={RiAlarmWarningFill} />{/* color="red.400"" */}
                                            Use Yoroi or Daedalus, do not send ADA from an exchange! 
                                            Send the exact amount or multiples up to 10x, without additional tokens.
                                    </ListItem>
                                    <ListItem>
                                        <ListIcon as={InfoIcon} />{/* color="teal.400"" */}
                                            Max 10 NFTs per TX. 
                                    </ListItem>
                                    <Spacer/>
                                </List>
                            </>
                        }
                        </Flex>
                        <Flex direction={["column", "column", "column", "column", "row"]}>
                            <Button 
                                width={["80vw", "80vw", "80vw", "70vw", "25vw", "25vw"]}
                                mt={["1vh", "1vh", "1vh", "1vh", "1vh", "5vh"]}
                                height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                                variant="ghost"
                                className={utilStyles.shadow}
                                transition="all 0.3s ease-in-out"
                                display={txSearch ? "none" : "flex"}
                                justifyContent={["flex-start", "flex-start", "center"]}
                                onClick={ () => showTxSearch(true) }
                            >
                                LOOKUP TX
                                <SearchIcon />
                            </Button>
                            <Flex
                                width={["80vw", "80vw", "80vw", "70vw", "25vw", "25vw"]}
                                mt={["1vh", "1vh", "1vh", "1vh", "1vh", "5vh"]}
                                height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                                className={utilStyles.shadow}
                                transition="all 0.3s ease-in-out"
                                display={txSearch ? "none" : ["none", "none", "none", "flex"]}
                            >
                                <PayBtn successCallback={successCallback} address={data.data.address} price={data.data.price} />
                            </Flex>
                        </Flex>
                        <Flex direction={txStatus ? ["column", "column", "column", "column", "row-reverse"] : ["column", "column", "column", "column", "row"]}>
                            <Button 
                                width={!txStatus ? "0px" : ["80vw", "80vw", "80vw", "70vw", "25vw", "25vw"]}
                                mt={["1vh", "1vh", "1vh", "1vh", "1vh", "5vh"]}
                                height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                                variant="ghost"
                                className={utilStyles.shadow}
                                transition="all 0.3s ease-in-out"
                                display={txStatus ? "flex" : "none"}
                                justifyContent={["flex-start", "flex-start", "center"]}
                                onClick={ () => showTxStatus(false) }
                            >
                                LOOKUP ANOTHER
                                <SearchIcon/>
                            </Button>
                            <Button 
                                width={["80vw", "80vw", "80vw", "70vw", "25vw", "25vw"]}
                                mt={["1vh", "1vh", "1vh", "1vh", "1vh", "5vh"]}
                                height={["8vh", "7vh", "15vh", "15vh", "15vh", "15vh"]}
                                variant="ghost"
                                className={utilStyles.shadow}
                                transition="all 0.3s ease-in-out"
                                display={txSearch ? "flex" : "none"}
                                justifyContent={["flex-start", "flex-start", "center"]}
                                onClick={ () => { 
                                    showTxSearch(!txSearch) 
                                    showTxStatus(false)
                                }}
                            >
                                GO BACK
                                <FaChevronLeft/>
                            </Button>
                            <Button 
                                width={["80vw", "80vw", "80vw", "70vw"]}
                                mt={["1vh", "1vh", "1vh"]}
                                height={["8vh", "7vh", "15vh"]}
                                variant="ghost"
                                className={utilStyles.shadow}
                                transition="all 0.3s ease-in-out"
                                display={["flex", "flex", "flex", "flex", "none"]}
                                justifyContent={["flex-start", "flex-start", "center"]}
                                onClick={onOpen}
                            >
                                ADDRESS
                                <IoIosWallet/>
                        </Button>
                        </Flex>
                    </Flex>
                    <Address display={["none", "none", "none", "none", "flex"]} address={data.data.address} />
                    {/* <Address display={mobileAddress ? "flex" : ["none", "none", "none", "none", "flex"]} /> */}
                </Stack>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader><Heading as="h3">Cardano address</Heading></ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Address address={data.data.address}/>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme="blue" onClick={onClose}>
                            CLOSE
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}