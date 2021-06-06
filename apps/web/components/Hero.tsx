import React from "react"
import NextChakraLink from './NextChakraLink'
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'
import { FaGithub, FaTwitter, FaMediumM } from 'react-icons/fa';
import useSound from 'use-sound';
import { LinkBox, LinkOverlay } from "@chakra-ui/react"
import mainStyles from './layout.module.css'
import { useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
  useColorMode,
  Icon,
  IconButton,
  Spacer
} from "@chakra-ui/react"
import Logo from "./Logo";
 
export default function Hero() {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [ exploring, explore ] = useState<boolean>(false)
  const [ h1playing, h1play ]= useState<boolean>(false)
  const [ h2playing, h2play ]= useState<boolean>(false)
  const [ h3playing, h3play ]= useState<boolean>(false)
  const [ logoplaying, logoplay ]= useState<boolean>(false)


  const playSound = (id: string) => {

  }

  const [play, { stop, sound }] = useSound("/sounds/landingSprite.mp3", {
     onend: function( soundId: any ) {
        console.log(this)
        const self = this
        switch(self._sounds[0]._sprite) {
          case "futuristicbasshit" : {
            // h2
            h2play(false)
            break
          }
          case "drumbasshit" : {
            // h1
            h1play(false)
            break
          }
          case "shortbasshit" : {
            // h3
            h3play(false)
            break
          }
          case "retrogamenotif" : {
            // logo
            logoplay(false)
            break
          }
          default: break
        }
    },
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
  /*sound.on('end', function( soundId: any ) {
    console.log(sound)
    switch(sound.nodeById( soundId ).sprite) {
      case "futuristicbasshit" : {
        // h2
        h2play(false)
        break
      }
      case "drumbasshit" : {
        // h1
        h1play(false)
        break
      }
      case "shortbasshit" : {
        // h3
        h3play(false)
        break
      }
      case "retrogamenotif" : {
        // logo
        logoplay(false)
        break
      }
      default: break
    }
  })*/
  return (

        <Flex
          align="center"
          justify="center"
          // bgColor={isDark ? ("gray.900") : ("gray.50")}
          // justify={{ base: "center", md: "space-around", xl: "space-between" }}
          direction={{ base: "column-reverse", md: "row" }}
          h={["60vh", "60vh", "60vh","70vh", "75vh", "80vh"]}
        >
          <Stack
            w={{ base: "80vw", md: "75vw" }}
            align="left"
            mt={["0vh", "0vh", "35vh", "35vh", "15vh", "15vh"]}  
                    
          >
             { !exploring ?
             <Flex w="100%" direction="row">
              <Flex direction="column">
                <Heading
                  as="h2"
                  fontSize={ h1playing ? [ "3.75rem", "3.75rem", "4rem", "4.75rem", "6rem", "10rem" ] : [ "3.5rem", "3.5rem", "3.75rem", "4.25rem", "5.125rem", "9rem" ]}
                  textAlign="left"
                  fontWeight="normal"
                  lineHeight="1"
                  transition="all 0.3s ease-in-out" 
                  onClick={ 
                    !h1playing ? 
                      () => {
                        h1play(true)
                        play({ id: 'drumbasshit' })
                      }
                      :
                      () => {
                        h1play(false)
                        stop('drumbasshit')
                      }
                    }
                >
                  CARDANO
                </Heading>
                <Heading
                  as="h2"
                  fontSize={ h2playing ? [ "4.3rem", "4.4rem", "5rem", "5.75rem", "6.5rem", "11.5rem" ] : [ "4.1rem", "4.1rem", "4.5rem", "5rem", "6rem", "10.5rem" ]}
                  textAlign="left"
                  fontWeight="normal"
                  lineHeight="1"
                  transition="all 0.4s ease-in-out" 
                  onClick={ 
                  !h2playing ? 
                    () => {
                      h2play(true)
                      play({ id: 'futuristicbasshit' })
                    }
                    :
                    () => {
                      h2play(false)
                      stop('futuristicbasshit')
                    }
                  }
                >
                  SOUNDS
                </Heading>
              </Flex>
              <Spacer />
              <Logo
                size={ logoplaying ?  [null, null, "11em", "11em", "16em", "19em"] : [null, null, "10em", "10em", "15em", "18em"]}
                color={isDark ? "gray.50" : "gray.900"}
                pos="absolute"
                top={[null, null, "10vh", "20vh", "15vh", "15vh"]} 
                right={[null, null, "15vw", "18vw", "18vw", "18vw"]}
                display={["none", "none", "flex", "flex", "flex", "flex"]}
                onclick={ 
                  !logoplaying ? 
                    () => {
                      logoplay(true)
                      play({ id: 'retrogamenotif' })
                    }
                    :
                    () => {
                      logoplay(false)
                      stop('retrogamenotif')
                    }
                }
              />
            </Flex> : <></>}
            <Flex
              direction={["column", "row", "row", "row" ]}
              w="100%"
            >
              <Heading
                as="h2"
                fontSize={ h3playing ? [ "6.125rem", "6.25rem", "6.3rem", "7.25rem", "9rem", "12rem" ]: [ "6rem", "6rem", "6rem", "6.75rem", "8rem", "11rem" ]} 
                textAlign="left"
                fontWeight="normal"
                lineHeight="1"
                display={exploring ? "none" : "initial"}
                transition="all 0.5s ease-in-out"
                onClick={ 
                  !h3playing ? 
                    () => {
                      h3play(true)
                      play({ id: 'shortbasshit' })
                    }
                    :
                    () => {
                      h3play(false)
                      stop('shortbasshit')
                    }
                }
              >
                NFT
              </Heading>
              
              <Spacer />

              <Button 
                //href="/"
                variant="ghost"
                textAlign="center"
                onClick={ () => explore(!exploring) }
                //padding="0 0.5vh 0.5vh 0.5vh"
                width={["70%", "70%", "25%", "25%", "25%", "25%" ]}
                mt={["4vh", "4vh", "5vh"]}
                height={["17vh", "15vh", "15vh", "15vh", "15vh", "15vh"]}
                className={utilStyles.shadow}
                position= "absolute"//{["inherit", "absolute", "absolute", "absolute"]}
                right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                bottom={["10vh", "10vh", "15vh", "15vh", "15vh", "15vh"]}
                transition="all 0.3s ease-in-out"
              >
                {!exploring ?
                <>
                <FaChevronRight
                    //mt={{ base: "5vh", md: "4" }}
                  height="40%"
                  aria-label="Explore CardanoSounds"
                  //size="lg"
                  fill="#4A5568"
                  //color="gray.600"
                >
                </FaChevronRight>
                <Heading
                  as="h3"
                  fontSize={["1rem", "1.125rem", "1.125rem", "1.5rem", "1.25rem", "1.5rem"]} 
                  textAlign="center"
                  fontWeight="normal"
                  lineHeight="1"
                  textColor="gray.600"
                  //my={4}
                  //mx={4}
                  textDecoration="none"
                  transition="all 0.3s ease-in-out"
                >
                  EXPLORE
                </Heading>
                </> 
                : 
                <>
                  <FaChevronLeft
                      //mt={{ base: "5vh", md: "4" }}
                    height="40%"
                    aria-label="Explore CardanoSounds"
                    //size="lg"
                    fill="#4A5568"
                    //color="gray.600"
                  >
                  </FaChevronLeft>
                  <Heading
                    as="h3"
                    fontSize={["1rem", "1.125rem", "1.125rem", "1.5rem", "1.25rem", "1.5rem"]} 
                    textAlign="center"
                    fontWeight="normal"
                    lineHeight="1"
                    textColor="gray.600"
                    //my={4}
                    //mx={4}
                    textDecoration="none"
                    transition="all 0.3s ease-in-out"
                  >
                    BACK
                  </Heading>
                </>
                }
              </Button>
            </Flex>
          </Stack>          
        <Stack 
            w={{ base: "5vw", md: "10vw" }}
            align="right"
            pos="absolute"
            right={["7vw", "4vw", "5vw", "5vw"]}
            bottom={[ "7vh", "10vh", "10vh", "15vh", "15vh", "15vh" ]}
            transition="all 0.3s ease-in-out"
            //mt={{ base: "10vh", md: "15vh" }}
          >
            <Flex display={{ base: "none", md: "flex"}} direction="column" h="50vh">
              <Heading 
                display={["none", "none", "flex", "flex"]} 
                size="lg" 
                as="h3"
                className={ isDark ? mainStyles.linkLight : mainStyles.link}
                //writingMode="tb" 
                onClick={()=>{}}
              >TWITTER
              </Heading>
              <Spacer />
              <Heading 
                display={["none", "none", "flex", "flex"]} 
                size="lg" 
                as="h3"
                className={ isDark ? mainStyles.linkLight : mainStyles.link}
                //writingMode="tb" 
                onClick={()=>{}}
              > GITHUB
              </Heading>
              <Spacer />
              <Heading 
                display={["none", "none", "flex", "flex"]} 
                size="lg" 
                as="h3"
                className={ isDark ? mainStyles.linkLight : mainStyles.link}
                //writingMode="tb" 
                onClick={()=>{}}
              > MEDIUM
              </Heading>
            </Flex>
            <Flex 
              justify="center"
              align="center"
              direction="column"
              display={{ base: "flex", md: "none"}}
            >
                <NextChakraLink href="https://twitter.com/CardanoSounds">
                  <IconButton
                    variant="ghost"
                    mt={2}
                    mr={2} 
                    aria-label="Twitter Cardano Sounds"
                    size="lg"
                    icon={
                          <FaTwitter />
                    }
                  />
                </NextChakraLink>
                <NextChakraLink href="https://github.com/zachyking/CardanoSounds">
                  <IconButton
                    variant="ghost"
                    mt={2}
                    mr={2} 
                    aria-label="Git Cardano Sounds"
                    size="lg"
                    icon={
                          <FaGithub />
                    }
                  />
                </NextChakraLink>
                 <NextChakraLink href="https://cardanosounds.medium.com">
                  <IconButton
                    variant="ghost"
                    mt={2}
                    mr={2} 
                    aria-label="Medium Cardano Sounds"
                    size="lg"
                    icon={
                          <FaMediumM />
                    }
                  />
                </NextChakraLink>
            </Flex>

          </Stack> 
          
         {/*  
            >
                <Button
                  borderRadius="8px"
                  py={4}
                  lineHeight={0.75}
                  size="md"
                  aria-label="Get NFT"
                >Explore</Button>
            </NextChakraLink>
         
          
         
          */}
         {/* <Box  w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 0, md: 0 }} mt={{ base: 6, md: 0 }}>
           <Image src="/new-logo.svg" size="100%" rounded="50%" shadow="2xl" /> 
           <Image src="/new-logo-big.svg" size="100%" />
          </Box>*/}

        </Flex>

  )
}
 