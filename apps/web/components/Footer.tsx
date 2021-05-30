
import React from "react"
import NextChakraLink from './NextChakraLink'
import { FaGithub, FaTwitter } from 'react-icons/fa';

import {
  Button,
  Flex,
  Heading,
  Stack,
  IconButton
} from "@chakra-ui/react"
 
export default function Footer() {
  return (
      <>
        <Flex
            display="column"
            align="center"
            justify="center"
            minH="5vh"
            mb="2vh"
        >
            
            <Stack

                w={{ base: "80%", md: "80%" }}
                  align="center" margin="auto"
                >
                <Flex 
                    justify="center"
                    align="center"
                >
                    <NextChakraLink href="https://twitter.com/CardanoSounds">
                    <IconButton
                      variant="ghost"
                      mt={2}
                      mr={2} 
                      aria-label="Close Menu"
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
                      aria-label="Close Menu"
                      size="lg"
                      icon={
                            <FaGithub />
                      }
                    />
                    </NextChakraLink>
                </Flex>
            </Stack> 
                
                
        </Flex>
      </>
  )
}