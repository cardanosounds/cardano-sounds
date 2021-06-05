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
       document.getElementById("navbar").style.marginTop = "-100px";
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
              transition="all 0.3s ease-out"

            >
                <Flex
                  align="center"
                  w="100vw"
                >
                  <Drawer onClose={onClose} isOpen={isOpen}>
                    <DrawerOverlay />
                    <DrawerContent>
                      <DrawerHeader borderBottomWidth="1px">Basic Drawer</DrawerHeader>
                      <DrawerBody>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                      </DrawerBody>
                    </DrawerContent>
                  </Drawer>   
                  <Spacer/>
                  <Flex right={0}>
                    {/*<IconButton 
                      variant="ghost"
                      aria-label="Toggle Dark Switch"
                      icon={isDark ? <SunIcon/> : <MoonIcon/>}
                      onClick={toggleColorMode}
                    />*/}
                    <Flex direction="column">
                      <Switch
                        //margin={["1em 1em", "0em 1.5em 0em 0em", "1em 1em", "1em 1em"]}
                        //margin-left={["0", "0", "2vw", "2vw"]}
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
                            //margin={["2em 0.5em 0.25em 1.5em", "0.5em 0.5em 0.25em 3.25em", "4em 0.5em 0.25em 6em",  "4em 0.5em 0.25em 10.5em"]}
                            aria-label="Open Menu"
                            variant="ghost"
                            size="lg"
                            icon={<FaChevronLeft/>}  
                            //display="flex"
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
            
            <Flex
              w="100vw"
              bgColor={isDark ? ("gray.900") : ("gray.50")}
              zIndex="dropdown"
              h="100vh"
              pos="relative"
              top="0"
              display={display}
              left="0"
              overflow="hidden"
              flexDir="column"
              as="nav"
            >
                <Flex justify="flex-end"
                >
                    <IconButton
                      variant="ghost"
                      mt={2}
                      mr={2} 
                      aria-label="Close Menu"
                      size="lg"
                      icon={
                          <CloseIcon />
                      }
                      onClick={closeMenu}
                    />
                </Flex>
                <Flex
                  flexDir="column"
                  align="center"
                >
                    <NextChakraLink href="/">
                        <Button
                          variant="ghost"
                          aria-label="Home"
                          my={5}
                          w="100%"
                          onClick={closeMenu}
                        >Home</Button>
                    </NextChakraLink>
                    <NextChakraLink  href="#collections">
                        <Button
                          variant="ghost"
                          aria-label="Collections"
                          my={5}
                          w="100%"
                          onClick={closeMenu}
                        >Collections</Button>
                    </NextChakraLink>
                    {/* <NextChakraLink href="/collections/mysticwave">
                        <Button
                          variant="ghost"
                          aria-label="Mystic waves"
                          my={5}
                          w="100%"
                          onClick={ () => changeDisplay('none')}
                        >Mystic waves</Button> 
                    </NextChakraLink>*/}
                    <NextChakraLink href="#contact">
                        <Button
                          variant="ghost"
                          aria-label="Contact"
                          my={5}
                          w="100%"
                          onClick={ closeMenu }
                        >Contact</Button>
                    </NextChakraLink>
                    <NextChakraLink href="/sale" className={mainStyles.disableEvents}>
                      <Flex
                        align="center"
                        display="flex"
                      >
                        <Button
                            disabled
                            variant="ghost"
                            aria-label="Sale"
                            my={5}
                            w="100%"
                            onClick={ closeMenu}
                        >Sale</Button>
                        <h2 className={mainStyles.rotate} >
                          Coming Soon!
                        </h2>
                      </Flex>
                    </NextChakraLink>
                </Flex>
                
            </Flex>
            
        </Flex>
    )
    // <IconButton 
        //     aria-label="Toggle Dark Switch"
        //     icon={colorMode === 'dark' ? <SunIcon/> : <MoonIcon/>}
        //     onClick={toggleColorMode}
        // />
}