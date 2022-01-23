import { useColorMode, Flex, Button, IconButton, Spacer, Heading, Box, Text, Stack, useDisclosure, Modal, ModalContent, ModalHeader, ModalOverlay, ModalCloseButton, ModalFooter, ModalBody } from '@chakra-ui/react'
import { useState, useEffect, useContext } from 'react'
import { FaChevronLeft } from 'react-icons/fa';
import { MdAccountBalanceWallet } from 'react-icons/md';
import { GiSoundOff, GiSoundOn } from 'react-icons/gi';
import useSound from 'use-sound';
import { MoonIcon, SunIcon} from '@chakra-ui/icons'
import NextChakraLink from './NextChakraLink'
import mainStyles from './layout.module.css'
import WalletContext from '../lib/WalletContext';
import ConnectWalletModal from './ConnectWalletModal';
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
    const walletCtx = useContext(WalletContext)
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

    const allowWallet = async () => {
      walletEnable(true)
      window.localStorage.setItem('cswallet', 'connected')
    }

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
      playSwitchSound()
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

    const enableCardano = async (wallet: string = 'nami') => {
      const win: any = window
      if(!win.cardano) return

      let baseWalletApi, fullWalletApi
      switch(wallet){
        case 'nami':
          baseWalletApi = win.cardano.nami
          break
        case 'ccvault':
          baseWalletApi = win.cardano.ccvault
          break
        case 'flint':
          baseWalletApi = win.cardano.flint
          break
        case 'gerowallet':
          if(!win.cardano.gerowallet){ 
            console.log("gero not inserted")
            return 
          }
          baseWalletApi = win.cardano.gerowallet
          break
      }
      // if(await baseWalletApi.isEnabled()) return walletModal.onClose()

      switch(wallet){
        case 'nami':
          fullWalletApi = await baseWalletApi.enable()
          // await baseWalletApi.enable()
          // fullWalletApi = win.cardano
          break
        case 'ccvault':
          fullWalletApi = await baseWalletApi.enable()
          break
        case 'flint':
          fullWalletApi = await baseWalletApi.enable()
          break
        case 'gerowallet':
          await baseWalletApi.enable()
          fullWalletApi = win.cardano.gerowallet
          break
      }

      if(!await baseWalletApi.isEnabled()) return

      walletCtx.update({walletApi: fullWalletApi})
      // console.log(walletCtx.walletApi)
      allowWallet()
      playSwitchSound()
      walletModal.onClose()
    }

    // const checkForWallet = async () => {
    //   const win: any = window
    //   if(win.cardano && await win.cardano.isEnabled() === true){
    //     allowWallet()
    //   }
    //   else {
    //     window.localStorage.setItem('cswallet', null)
    //   }
    // }

    const playSound = (id: string) => {
      if(window.localStorage.getItem('sound') === 'false') return
      play({id: id})
    }

    const playClickSound = () => {
      playSound("click")
    }

    const playSwitchSound = () => {
     playSound("lightswitch")
    }

    useEffect(() => { 
      var prevScrollpos = window.pageYOffset;
      window.onscroll = function() {
        var currentScrollPos = window.pageYOffset;
        if (prevScrollpos > currentScrollPos) {
          document.getElementById("navbar").style.top = "0";
        } else {
          document.getElementById("navbar").style.top = "-500px";
        }
        prevScrollpos = currentScrollPos;
      }
      
      const win: any = window
      // checkForWallet()
      // enableCardano()
      if(win.localStorage.getItem('sound') === null)
      {
        win.localStorage.setItem('sound', 'true')
      }
      else if(win.localStorage.getItem('sound') === 'false'){
        soundAbility(false)
      }

    }, [])

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
                  <Drawer onClose={()=> {
                    playClickSound()
                    onClose()
                  }} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerHeader borderBottomWidth="1px" background="transparent url(/noise.png) repeat 0 0">
                        <DrawerCloseButton />
                        <Logo size={["2em", "3em", "2em", "5em", "5em", "5em"]} color={ isDark ? "white" : "gray.800" }/>
                      </DrawerHeader>
                      <DrawerBody background="transparent url(/noise.png) repeat 0 0">
                        <NextChakraLink href="/buy">{/*  className={mainStyles.disableEvents} */}
                            <Heading size="lg" as="h4">BUY</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/">
                            <Heading size="lg" as="h4">HOME</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="https://cardanosounds.com">
                            <Heading size="lg" as="h4">ABOUT</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/create">
                            <Heading size="lg" as="h4">CREATE</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/sounds/all">
                            <Heading size="lg" as="h4">SOUNDS</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/mint">
                            <Heading size="lg" as="h4">MINT</Heading>
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
                    {ConnectWalletModal(walletModal.isOpen, walletModal.onClose, isDark, walletEnabled, enableCardano)}
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
                      onClick={() => {
                        toggleColorMode()
                        playSwitchSound()
                      }}
                      _hover={{cursor: "pointer"}}
                    />
                    :
                    <SunIcon
                      position="absolute"
                      right={["8vw", "6vw", "5vw", "5vw"]}
                      top="5vh"
                      onClick={() => {
                        toggleColorMode()
                        playSwitchSound()
                      }}
                       _hover={{cursor: "pointer"}}
                    />
                    }
                        <Flex height="10vh" width="10vw" position="absolute"
                            top="15vh"
                            right="0">
                          <IconButton 
                            aria-label="Open Menu"
                            variant="ghost"
                            bgColor={isDark ? "rgba(26, 32, 44, 0.6)" : "rgba(255, 255, 255, 0.6)"}
                            size="lg"
                            icon={<FaChevronLeft/>}  
                            onClick={ () => {
                              playClickSound()
                              onOpen() 
                            }} 
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
