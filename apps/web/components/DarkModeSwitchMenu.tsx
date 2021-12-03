import { useColorMode, Switch, Flex, Button, IconButton, Spacer, Heading, Box, Text, Stack, useDisclosure, useColorModeValue, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalFooter, ModalBody } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { GiSoundOff, GiSoundOn } from 'react-icons/gi';
import { AiOutlineMenuFold } from 'react-icons/ai'
import { CloseIcon, MoonIcon, SunIcon, HamburgerIcon, ChevronLeftIcon } from '@chakra-ui/icons'
import NextChakraLink from './NextChakraLink'
import mainStyles from './layout.module.css'
import Logo from './Logo'
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react"

// import { MoonIcon, SunIcon } from '@chakra-ui/icons'

export default function DarkModeSwitchMenu({ home }: { home?: boolean }) {
    const { colorMode, toggleColorMode } = useColorMode()
    const [sound, soundAbility] = useState<boolean>(true)
    const isDark = colorMode === 'dark'
    const [walletEnabled, walletEnable] = useState<boolean>(false)
    const { isOpen, onOpen, onClose } = useDisclosure()
    const walletModal: {
      isOpen: boolean;
      onOpen: () => void;
      onClose: () => void;
      onToggle: () => void;
      isControlled: boolean;
      getButtonProps: (props?: any) => any;
      getDisclosureProps: (props?: any) => any;
    } = useDisclosure()

    const changeSound = () => {
      if(window.localStorage.getItem('sound') === 'true')
      {
        window.localStorage.setItem('sound', 'false')
        soundAbility(false)
      }
      else {
        window.localStorage.setItem('sound', 'true')
        soundAbility(true)
      }
    }

    const enableCardano = async () => {
      const win: any = window
      if(!win.cardano) return
      if(await win.cardano.isEnabled()) return

      await win.cardano.enable()

      if(!await win.cardano.isEnabled()) return
      walletEnable(true)
      walletModal.onClose()
    }

    const checkForWallet = async () => {
      const win: any = window
      if(win.cardano && await win.cardano.isEnabled() === true){
        walletEnable(true)
      }
    }

    useEffect(() => { 
      const win: any = window
      checkForWallet()
      // enableCardano()
      if(win.localStorage.getItem('sound') === null)
      {
        win.localStorage.setItem('sound', 'true')
      }
      else if(win.localStorage.getItem('sound') === 'false'){
        soundAbility(false)
      }

      var prevScrollpos = window.pageYOffset;
      window.onscroll = function() {
      var currentScrollPos = window.pageYOffset;
      if (prevScrollpos > currentScrollPos) {
        document.getElementById("navbar").style.marginTop = "0px";
      } else {
        document.getElementById("navbar").style.marginTop = "-30vh";
      }
      prevScrollpos = currentScrollPos;
    }}, [])

    return (
        <Flex
          flexDir="column"
          align="flex-end"
          margin="0"
        >
            <Flex
              pos="fixed"
              align="center"
              //w="100vw"
              top="0px"
              left="0px"
              right="0px"
              // bgColor={isDark ? "gray.800" : "white"}
              as="nav"
              justify="center"
              wrap="wrap"
              id="navbar" 
              transition="all 0.3s ease-in-out"

            >
                <Flex
                  align="center"
                  w="100vw"
                >
                  <Drawer onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerHeader borderBottomWidth="1px" background="transparent url(http://assets.iceable.com/img/noise-transparent.png) repeat 0 0">
                        <DrawerCloseButton />
                        <Logo size={["2em", "3em", "2em", "5em", "5em", "5em"]} color={ isDark ? "white" : "gray.800" }/>
                      </DrawerHeader>
                      <DrawerBody background="transparent url(http://assets.iceable.com/img/noise-transparent.png) repeat 0 0">
                        <NextChakraLink href="/prebuy" className={mainStyles.disableEvents}>
                            <Heading size="lg" as="h4">BUY</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/">
                            <Heading size="lg" as="h4">HOME</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="https://cardanosounds.com">
                            <Heading size="lg" as="h4">ABOUT</Heading>
                        </NextChakraLink>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                  <NextChakraLink href="/">
                    <Box 
                      align="flex-start"
                      //50vw 5vh
                      margin={["3vh 0 2vh 8vw", "3vh 0 2vh 8vw", "4vh 0.5em 0.25em 3em", "7vh 0.5em 0.25em 4em", "5vh 0.5em 0.25em 6em",  "5vh 0.5em 0.25em 11em"]}
                      aria-label="Cardano Sounds home"
                      variant="ghost"
                      
                      display={ home ? ["flex", "flex", "none"] : "flex"}
                      onClick={ () => {} }
                      transition="all 0.3s ease-in-out"                      
                    >
                      <Stack direction="row">
                      <Logo 
                          size={["4em", "4em", "4em", "4em", "5em" ]}
                          color={isDark ? ("white") : ("gray.800")} 
                      />
                      <Heading display={["none", "none", "flex"]} fontSize="3xl" pt="2.5vh">CARDANO SOUNDS</Heading>
                      </Stack>
                    </Box>
                  </NextChakraLink>
                  <Spacer/>
                  <Flex
                   position="absolute"
                   right={["24vw", "18vw", "11vw", "11vw"]}
                   top="5vh"
                   direction="row"
                   _hover={{cursor: "pointer"}}
                   onClick={walletModal.onOpen}>
                    { walletEnabled ?
                      <div className={mainStyles.ledgreen}></div>
                      :
                      <div className={mainStyles.ledorange}></div>
                    }
                    <MdAccountBalanceWallet />
                    <Modal isOpen={walletModal.isOpen} onClose={walletModal.onClose}>
                      <ModalOverlay />
                           
                      <ModalContent 
                        backgroundColor={isDark ? ("gray.800") : ("white")}
                        background="transparent url(http://assets.iceable.com/img/noise-transparent.png) repeat 0 0">
                        <ModalHeader>Connect wallet</ModalHeader>
                        <ModalCloseButton />      
                        <ModalBody>
                          {walletEnabled ?
                            <Text>Nami wallet connected</Text> : <></>}
                        </ModalBody>
                        <ModalFooter>
                          {!walletEnabled ?
                          <Button colorScheme='blue' mr={3} onClick={enableCardano}>
                            Connect Nami
                          </Button> : <></>}
                          <Button onClick={walletModal.onClose}>Close</Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                  </Flex>
                  <Flex
                   position="absolute"
                   right={["16vw", "12vw", "8vw", "8vw"]}
                   top="5vh"
                   direction="row"
                   _hover={{cursor: "pointer"}}>
                    {sound ?
                    <GiSoundOn onClick={() => changeSound()} />
                    :
                    <GiSoundOff onClick={() => changeSound()}/>
                    } 
                  </Flex>
                  <Flex right={0}>
                    <Flex direction="column">
                    {isDark ?  
                    <MoonIcon
                      position="absolute"
                      right={["8vw", "6vw", "5vw", "5vw"]}
                      top="5vh"
                      // isChecked={isDark}
                      onClick={toggleColorMode}
                      _hover={{cursor: "pointer"}}
                    />
                    :
                    <SunIcon
                      position="absolute"
                      right={["8vw", "6vw", "5vw", "5vw"]}
                      top="5vh"
                      // isChecked={isDark}
                      onClick={toggleColorMode}
                       _hover={{cursor: "pointer"}}
                    />
                    }
                      {/* <Switch
                        position="absolute"
                        right={["8vw", "6vw", "5vw", "5vw"]}
                        top="5vh"
                        color="gray.800"
                        isChecked={isDark}
                        onChange={toggleColorMode}
                      /> */}
                        <Flex height="10vh" width="10vw" position="absolute"
                            top="15vh"
                            right="0">
                          <IconButton 
                            aria-label="Open Menu"
                            variant="ghost"
                            bgColor={isDark ? "rgba(26, 32, 44, 0.6)" : "rgba(255, 255, 255, 0.6)"}
                            size="lg"
                            icon={<FaChevronLeft/>}  
                            onClick={ onOpen } 
                            display={["flex", "flex", "flex", "flex"]} 
                            position="absolute"
                            right={["6vw", "5vw", "5vw", "5vw"]}                      
                          />
                        </Flex>
                        
                    </Flex>

                  </Flex>
              </Flex>
            </Flex>           
        </Flex>
    )
}