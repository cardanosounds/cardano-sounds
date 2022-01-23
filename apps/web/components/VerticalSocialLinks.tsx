import React from "react"
import NextChakraLink from './NextChakraLink'
import { FaGithub, FaTwitter, FaMediumM } from 'react-icons/fa';
import mainStyles from './layout.module.css'

import {
  Button,
  Spacer,
  Flex,
  Heading,
  Stack,
  IconButton,
  Text,
  useColorMode
} from "@chakra-ui/react"
 
export default function Footer() {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
      <>
        <Stack 
            w="5vw"
            align="right"
            pos="absolute"
            right={["0vw", "4vw", "5vw", "5vw", "3vw", "2vw"]}
            bottom={[ "5vh", "10vh", "10vh", "15vh", "15vh", "15vh" ]}
            transition="all 0.3s ease-in-out"
            style={{transitionDelay: `700ms`}}
            //mt={{ base: "10vh", md: "15vh" }}
          >
            <Flex display={{ base: "none", md: "flex"}} direction="column" h="50vh">
              <NextChakraLink href="https://twitter.com/CardanoSounds">
                <Heading 
                  display={["none", "none", "flex", "flex"]} 
                  size="lg" 
                  as="h3"
                  className={ isDark ? mainStyles.linkLight : mainStyles.link}
                  //writingMode="tb" 
                  onClick={()=>{}}
                >TWITTER
                </Heading>
              </NextChakraLink>
              <Spacer />
              <NextChakraLink href="https://github.com/cardanosounds/cardano-sounds">
                <Heading 
                  display={["none", "none", "flex", "flex"]} 
                  size="lg" 
                  as="h3"
                  className={ isDark ? mainStyles.linkLight : mainStyles.link}
                  //writingMode="tb" 
                  onClick={()=>{}}
                > GITHUB
                </Heading>
              </NextChakraLink>
              <Spacer />
              <NextChakraLink href="https://cardanosounds.medium.com">
                <Heading 
                  display={["none", "none", "flex", "flex"]} 
                  size="lg" 
                  as="h3"
                  className={ isDark ? mainStyles.linkLight : mainStyles.link}
                  //writingMode="tb" 
                  onClick={()=>{}}
                > MEDIUM
                </Heading>
              </NextChakraLink>
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
                    mr={10} 
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
                    mr={10} 
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
                    mr={10} 
                    aria-label="Medium Cardano Sounds"
                    size="lg"
                    icon={
                          <FaMediumM />
                    }
                  />
                </NextChakraLink>
            </Flex>

          </Stack> 
      </>
  )
}