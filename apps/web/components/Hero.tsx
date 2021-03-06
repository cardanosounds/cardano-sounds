import React, { useEffect } from "react"
import { FaChevronRight, FaChevronLeft } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'
import useSound from 'use-sound';
import { useState } from 'react'
import {
  Button,
  Flex,
  Heading,
  Stack,
  useColorMode,
  Spacer
} from "@chakra-ui/react"
import Logo from "./Logo";
import Explore from "./Explore";
import VerticalSocialLinks from "./VerticalSocialLinks";
import GlitchText from "./GlitchText";
 
export default function Hero() {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [ exploring, explore ] = useState<boolean>(false)
  const [ h1playing, h1play ]= useState<boolean>(false)
  const [ h2playing, h2play ]= useState<boolean>(false)
  const [ h3playing, h3play ]= useState<boolean>(false)
  const [ logoplaying, logoplay ]= useState<boolean>(false)
  const [ glitching, setGlitching ]= useState<boolean>(true)

  useEffect(() => { 
    setTimeout(() => setGlitching(false), 1500);
  }, [])

  const glitchingText = (text: string) => {
    if(glitching) return <GlitchText>{text}</GlitchText>

    return <>{text}</>
  }
  
  const goBackFunc = () => {
      explore(false)
  }

  const playClickSound = () => {
    if(window.localStorage.getItem('sound') === 'false') return
    
    play({id: "click"})
  }

  const [play, { stop }] = useSound("/sounds/landingSprite.mp3", {
     onend: function() {
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
  return (

        <Flex
          align="center"
          justify="center"
          // bgColor={isDark ? ("gray.900") : ("gray.50")}
          // justify={{ base: "center", md: "space-around", xl: "space-between" }}
          direction={{ base: "column-reverse", md: "row" }}
          minH={["85vh", "85vh", "80vh", "80vh", "90vh", "90vh"]}
        >
          <Stack
            w={{ base: "70vw", md: "75vw" }}
            align="left"
          >
             { !exploring ?
             <Flex w="100%" direction="row"
              mt={["25vh", "28vh", "12vh", "15vh", "0vh", "0vh"]} 
             >
              <Flex direction="column">
                <Heading
                  as="h2"
                  fontSize={ h1playing ? [ "3.75rem", "4.25rem", "4rem", "4.75rem", "6rem", "10rem" ] : [ "3.5rem", "4rem", "3.75rem", "4.25rem", "5.125rem", "9rem" ]}
                  textAlign="left"
                  fontWeight="normal"
                  lineHeight="1"
                  transition="all 0.3s ease-in-out" 
                  className={utilStyles.pointerOnHover}
                  onClick={ 
                    !h1playing ? 
                      () => {
                        h1play(true)
                        if(window.localStorage.getItem('sound') === 'true'){
                          play({ id: 'drumbasshit' })
                        }
                      }
                      :
                      () => {
                        h1play(false)
                        stop('drumbasshit')
                      }
                    }
                >
                  {glitchingText("CARDANO")}
                </Heading>
                <Heading
                  as="h2"
                  fontSize={ h2playing ? [ "4.3rem", "5rem", "5rem", "5.75rem", "6.5rem", "11.5rem" ] : [ "4.1rem", "4.75rem", "4.5rem", "5rem", "6rem", "10.5rem" ]}
                  textAlign="left"
                  fontWeight="normal"
                  lineHeight="1"
                  transition="all 0.4s ease-in-out" 
                  className={utilStyles.pointerOnHover}
                  onClick={ 
                  !h2playing ? 
                    () => {
                      h2play(true)
                      if(window.localStorage.getItem('sound') === 'true'){
                        play({ id: 'futuristicbasshit' })
                      }
                    }
                    :
                    () => {
                      h2play(false)
                      stop('futuristicbasshit')
                    }
                  }
                >
                  {glitchingText("SOUNDS")}
                </Heading>
              </Flex>
              <Spacer />
              <Logo
                size={ logoplaying ?  [null, null, "11em", "11em", "16em", "19em"] : [null, null, "10em", "10em", "15em", "16em"]}
                color={isDark ? "white" : "gray.800"}
                pos="absolute"
                top={[null, null, "15vh", "15vh", "15vh", "15vh"]} 
                right={[null, null, "15vw", "18vw", "18vw", "18vw"]}
                display={["none", "none", "flex", "flex", "flex", "flex"]}
                style={{transitionDelay: `700ms`}}
                onclick={ 
                  !logoplaying ? 
                    () => {
                      logoplay(true)
                      if(window.localStorage.getItem('sound') === 'true'){
                        play({ id: 'retrogamenotif' })
                      }
                    }
                    :
                    () => {
                      logoplay(false)
                      stop('retrogamenotif')
                    }
                }
              />
            </Flex> 
            : 
            <>
              <Explore goBackFunc={ goBackFunc } soundFunc={playClickSound}/>
            </>
            }
            <Flex
              direction={["column", "column", "row", "row" ]}
              w="100%"
            >
              <Heading
                as="h2"
                fontSize={ h3playing ? [ "6.125rem", "9rem", "6.3rem", "7.25rem", "9rem", "12rem" ] : [ "6rem", "8rem", "6rem", "6.75rem", "8rem", "11rem" ]} 
                textAlign="left"
                fontWeight="normal"
                lineHeight="1"
                display={exploring ? "none" : "initial"}
                className={utilStyles.pointerOnHover}
                transition="all 0.5s ease-in-out"
                onClick={ 
                  !h3playing ? 
                    () => {
                      h3play(true)
                      if(window.localStorage.getItem('sound') === 'true'){
                        play({ id: 'shortbasshit' })
                      }
                    }
                    :
                    () => {
                      h3play(false)
                      stop('shortbasshit')
                    }
                }
              >
                {glitchingText("NFT")}
                {/* <GlitchText>NFT</GlitchText> */}
              </Heading>
              
              <Spacer />

              <Button 
                //href="/"
                variant="ghost"
                textAlign="center"
                onClick={ () => { 
                  explore(!exploring) 
                  playClickSound()
                }}
                style={{transitionDelay: `700ms`}}
                //padding="0 0.5vh 0.5vh 0.5vh"
                width={["70%", "70%", "25%", "25%", "25%", "25%" ]}
                mt={["4vh", "4vh", "5vh"]}
                height={["17vh", "15vh", "15vh", "15vh", "15vh", "15vh"]}
                className={utilStyles.shadow}
                position= {["inherit", "inherit", "absolute", "absolute", "absolute", "absolute"]}
                right={["20vw", "20vw", "15vw", "15vw", "15vw", "15vw"]}
                bottom={["12vh", "12vh", "15vh", "15vh", "15vh", "25vh"]}
                transition="all 0.3s ease-in-out"
                display={ exploring ? ["none", "none", "flex"] : "flex"}
                justifyContent={["flex-start", "flex-start", "center"]}
              >
                {!exploring ?
                <>
              
                {/* <Heading
                  as="h3"
                  fontSize="1.5rem"
                  // fontSize={["1rem", "1.125rem", "1.125rem", "1.5rem", "1.25rem", "2.25rem"]} 
                  textAlign="center"
                  fontWeight="normal"
                  lineHeight="1"
                  //textColor="gray.600"
                  //my={4}
                  //mx={4}
                  textDecoration="none"
                  transition="all 0.3s ease-in-out"
                > */}
                  EXPLORE
                  <FaChevronRight
                    //mt={{ base: "5vh", md: "4" }}
                  // height="40%"
                  aria-label="Explore CardanoSounds"
                  // size={36}
                  // fill="#4A5568"
                  //color="gray.600"
                >
                </FaChevronRight>
                {/* </Heading> */}
                </> 
                : 
                <>
                  
                  {/* <Heading
                    as="h3"
                    fontSize="1.5rem"
                    // fontSize={["1rem", "1.125rem", "1.125rem", "1.5rem", "1.75rem", "2.25rem"]} 
                    textAlign="center"
                    fontWeight="normal"
                    lineHeight="1"
                    //textColor="gray.600"
                    //my={4}
                    //mx={4}
                    textDecoration="none"
                    transition="all 0.3s ease-in-out"
                  > */}
                    BACK
                    <FaChevronLeft
                    //mt={{ base: "5vh", md: "4" }}
                    height="40%"
                    aria-label="Go back"
                    //size="lg"
                    // fill="#4A5568"
                    //color="gray.600"
                  ></FaChevronLeft>
                  {/* </Heading> */}
                </>
                }
              </Button>
            </Flex>
          </Stack>   

          <VerticalSocialLinks/>

      </Flex>

  )
}
 