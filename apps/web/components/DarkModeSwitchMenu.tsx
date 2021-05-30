import { useColorMode, Switch, Flex, Button, IconButton } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { CloseIcon, MoonIcon, SunIcon, HamburgerIcon } from '@chakra-ui/icons'
import NextChakraLink from './NextChakraLink'
import mainStyles from './layout.module.css'

// import { MoonIcon, SunIcon } from '@chakra-ui/icons'


export default function DarkModeSwitchMenu({ home }: { home?: boolean }) {
    const { colorMode, toggleColorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const [display, changeDisplay] = useState('none')

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
          align="center"
          margin="0"
        >
            <Flex
              pos="fixed"
              align="center"
              w="100vw"
              top="0px"
              left="0px"
              right="0px"
              bgColor={isDark ? ("gray.900") : ("gray.50")}
              as="nav"
              justify="center"
              wrap="wrap"
              id="navbar" 
              transition="all 0.6s ease-out"

            >
                <Flex
                  align="center"
                  w="100vw"
                >
                  <Flex 
                    justify={["center", "space-between", "flex-end", "flex-end"]}
                    display={['none', 'none', 'flex', 'flex']}
                  >
                      <NextChakraLink href="/">
                          <Button
                            variant="ghost"
                            aria-label="Home"
                            my={5}
                            w="100%"
                          >Home</Button>
                      </NextChakraLink>
                      <NextChakraLink href={ home ? "#collections": "/#collections"}>
                          <Button
                            variant="ghost"
                            aria-label="Collections"
                            my={5}
                            w="100%"
                          >Collections</Button>
                      </NextChakraLink>
                      {/* <NextChakraLink href="/collections/mysticwave">
                          <Button
                            variant="ghost"
                            aria-label="Mystic waves"
                            my={5}
                            w="100%"
                          >Mystic waves</Button>
                      </NextChakraLink> */}
                      <NextChakraLink href={ home ? "#contact": "/#contact"}>
                          <Button
                            variant="ghost"
                            aria-label="Contact"
                            my={5}
                            w="100%"
                          >Contact</Button>
                      </NextChakraLink>
                      {/*className={mainStyles.disableEvents}>*/}
                      <NextChakraLink href="/sale"> 
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
                            ><h1>Sale</h1></Button>
                            <h2 className={mainStyles.rotate} >
                              Coming Soon!
                            </h2>
                          </Flex>
                      </NextChakraLink>
                      
                  </Flex>

                  <IconButton 
                    margin="0.25em 0.5em"
                    aria-label="Open Menu"
                    variant="ghost"
                    size="lg"
                    icon={<HamburgerIcon />}
                    display={['flex', 'flex', 'none', 'none']}
                    onClick={ openMenu }
                  />
                  <Flex right={0}>
                    <IconButton 
                      variant="ghost"
                      aria-label="Toggle Dark Switch"
                      icon={isDark ? <SunIcon/> : <MoonIcon/>}
                      onClick={toggleColorMode}
                    />
                    {/* <Switch
                      margin="0.25em 0.5em"
                      color="blue"
                      isChecked={isDark}
                      onChange={toggleColorMode}
                    /> */}
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
              left="0"
              display={display}
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