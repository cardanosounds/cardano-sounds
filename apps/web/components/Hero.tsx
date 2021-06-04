import React from "react"
import NextChakraLink from './NextChakraLink'
import { FaChevronRight } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'
import { FaGithub, FaTwitter, FaMediumM } from 'react-icons/fa';
import { LinkBox, LinkOverlay } from "@chakra-ui/react"
import mainStyles from './layout.module.css'
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
 
export default function Hero() {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (

        <Flex
          align="center"
          justify="center"
          // bgColor={isDark ? ("gray.900") : ("gray.50")}
          // justify={{ base: "center", md: "space-around", xl: "space-between" }}
          direction={{ base: "column-reverse", md: "row" }}
          h="85vh"
        >
          <Stack
            w={{ base: "80vw", md: "75vw" }}
            align="left"
            mt={{ base: "25vh", md: "30vh" }}
          >
            <Heading
              as="h2"
              fontSize={[ "3.5rem", "3.5rem", "5.125rem", "9rem" ]}
              textAlign="left"
              fontWeight="normal"
              lineHeight="1"
            >
              CARDANO
            </Heading>
            <Heading
              as="h2"
              fontSize={[ "4.1rem", "4.1rem", "6rem", "10rem" ]}
              textAlign="left"
              fontWeight="normal"
              lineHeight="1"
            >
              SOUNDS
            </Heading>
            <Flex
              direction={["column", "row", "row", "row" ]}
              w="100%"
            >
              <Heading
                as="h2"
                fontSize={[ "6rem", "6rem", "8rem", "11rem" ]}
                textAlign="left"
                fontWeight="normal"
                lineHeight="1"
              >
                NFT
              </Heading>
              <Spacer />

              <LinkBox 
                href="/"
                borderColor="gray.600"
                //borderTopWidth={{ base: "0.5vh", md: "0" }}
                //borderLeftWidth={{ base: "0", md: "0.5vh" }}
                textAlign="center"
                //padding="0 0.5vh 0.5vh 0.5vh"
                width={["80%", "25%", "25%", "25%" ]}
                mt={["4vh", "4vh", "5vh"]}
                height={["20vh", "20vh", "15vh", "15vh"]}
                className={utilStyles.shadow}
                position={["inherit", "absolute", "absolute", "absolute"]}
                right="15vw"
                bottom="15vh"
              >
                <IconButton
                      variant="ghost"
                      //mt={{ base: "5vh", md: "4" }}
                      aria-label="Explore CardanoSounds"
                      size="lg"
                      color="gray.600"
                      icon={
                            <FaChevronRight />
                      } >
                
                </IconButton>
                <Text
                  fontSize={["1.5rem", "1.5rem", "2rem", "2.125rem"]} 
                  textAlign="center"
                  fontWeight="normal"
                  lineHeight="1"
                  textColor="gray.600"
                  my={4}
                  mx={4}
                  textDecoration="none"
                >
                  explore
                </Text>
              </LinkBox>
            </Flex>
          </Stack>
        <Stack 
            w={{ base: "5vw", md: "10vw" }}
            align="right"
            pos="absolute"
            right={["7vw", "4vw", "5vw", "5vw"]}
            bottom={{ base: "7vh", md: "15vh" }}
            //mt={{ base: "10vh", md: "15vh" }}
          >
            <Flex display={{ base: "none", md: "flex"}} direction="column" h="40vh">
              <Heading 
                display={["none", "none", "flex", "flex"]} 
                size="lg" 
                as="h3"
                className={mainStyles.link}
                //writingMode="tb" 
                onClick={()=>{}}
              >TWITTER
              </Heading>
              <Spacer />
              <Heading 
                display={["none", "none", "flex", "flex"]} 
                size="lg" 
                as="h3"
                className={mainStyles.link}
                //writingMode="tb" 
                onClick={()=>{}}
              >GITHUB
              </Heading>
              <Spacer />
              <Heading 
                display={["none", "none", "flex", "flex"]} 
                size="lg" 
                as="h3"
                className={mainStyles.link}
                //writingMode="tb" 
                onClick={()=>{}}
              >MEDIUM
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
 