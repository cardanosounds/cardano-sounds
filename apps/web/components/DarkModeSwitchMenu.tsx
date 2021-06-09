import { useColorMode, Switch, Flex, Button, IconButton, Spacer, Heading, Image, Icon, useDisclosure } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { FaChevronLeft } from 'react-icons/fa';
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
    const isDark = colorMode === 'dark'
    const [display, changeDisplay] = useState('none')
    const { isOpen, onOpen, onClose } = useDisclosure()


    const closeMenu = () => { 
      changeDisplay('none')
      document.getElementsByTagName('body')[0].style.overflow = 'visible'
    }

    const openMenu = () => { 
      changeDisplay('flex')
      document.getElementsByTagName('body')[0].style.overflow = 'hidden'
    }

    useEffect(() => { 
    
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
              //bgColor={isDark ? ("gray.900") : ("gray.50")}
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
                      <DrawerHeader borderBottomWidth="1px">
                        <DrawerCloseButton />
                        <Logo size={["2em", "3em", "2em", "5em", "5em", "5em"]} color={ isDark ? "gray.50" : "gray.900" }/>
                      </DrawerHeader>
                      <DrawerBody>
                        <NextChakraLink href="/sale" className={mainStyles.disableEvents}>
                            <Heading size="lg" as="h4">BUY</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/">
                            <Heading size="lg" as="h4">HOME</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/">
                            <Heading size="lg" as="h4">ABOUT</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/">
                            <Heading size="lg" as="h4">NFTS</Heading>
                        </NextChakraLink>
                        <NextChakraLink href="/sounds/all/1">
                            <Heading size="lg" as="h4">SOUNDS</Heading>
                        </NextChakraLink>
                        
                        
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>
                  <IconButton 
                    align="flex-start"
                    //50vw 5vh
                    margin={["7vh 0 0 8vw", "7vh 0 0 8vw", "7vh 0.5em 0.25em 3em", "7vh 0.5em 0.25em 4em", "5vh 0.5em 0.25em 6em",  "5vh 0.5em 0.25em 11em"]}
                    aria-label="Cardano Sounds home"
                    variant="ghost"
                    size="lg"
                    icon={
                      <Logo 
                        size={["4em", "4em", "4em", "4em", "5em" ]}
                        color={isDark ? ("gray.50") : ("gray.900")} 
                      />
                    }
                    display={ home ? ["flex", "flex", "none"] : "flex"}
                    onClick={ () => {} }
                    transition="all 0.3s ease-in-out"
                  />   
                  <Spacer/>
                  <Flex right={0}>
                    <Flex direction="column">
                      <Switch
                        position="absolute"
                        right={["8vw", "6vw", "5vw", "5vw"]}
                        top="5vh"
                        color="gray.50"
                        isChecked={isDark}
                        onChange={toggleColorMode}
                      />
                        <Flex height="10vh" width="10vw" position="absolute"
                            top="15vh"
                            right="0">
                          <IconButton 
                            aria-label="Open Menu"
                            variant="ghost"
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