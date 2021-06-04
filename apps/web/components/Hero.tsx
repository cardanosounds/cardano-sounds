import React from "react"
import NextChakraLink from './NextChakraLink'
import { FaChevronRight } from 'react-icons/fa';
import utilStyles from '../styles/utils.module.css'
import { FaGithub, FaTwitter, FaMediumM } from 'react-icons/fa';
import { LinkBox, LinkOverlay } from "@chakra-ui/react"
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
            w={{ base: "80vw", md: "70vw" }}
            align="left"
            mt={{ base: "20vh", md: "15vh" }}
          >
            <Heading
              as="h2"
              fontSize={{ base: "3.5rem", md: "8rem" }}
              textAlign="left"
              fontWeight="normal"
              lineHeight="1"
            >
              cardano
            </Heading>
            <Heading
              as="h2"
              fontSize={{ base: "4.2rem", md: "9rem" }}
              textAlign="left"
              fontWeight="normal"
              lineHeight="1"
            >
              sounds
            </Heading>
            <Flex
              direction={{ base: "column", md: "row" }}
              w="100%"
            >
              <Heading
                as="h2"
                fontSize={{ base: "6rem", md: "10rem" }} 
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
                borderTopWidth={{ base: "0.5vh", md: "0" }}
                borderLeftWidth={{ base: "0", md: "0.5vh" }}
                textAlign="center"
                padding="0 0.5vh 0.5vh 0.5vh"
                width={{ base: "80%", md: "40%" }}
                mt="5vh"
                className={utilStyles.shadow}
              >
                <IconButton
                      variant="ghost"
                      mt={{ base: "5vh", md: "4" }}
                      aria-label="Explore CardanoSounds"
                      size="2xl"
                      color="gray.600"
                      icon={
                            <FaChevronRight />
                      } >
                
                </IconButton>
                <Text
                  fontSize={{ base: "1.5rem", md: "2rem" }} 
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
            right="7vw"
            bottom={{ base: "8vh", md: "10vh" }}
            //mt={{ base: "10vh", md: "15vh" }}
          >
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
 