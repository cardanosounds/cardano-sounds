
import React from "react"
import NextChakraLink from './NextChakraLink'
import { FaGithub, FaTwitter } from 'react-icons/fa';

import {
  Button,
  Flex,
  Heading,
  Stack,
  IconButton,
  Text
} from "@chakra-ui/react"
import SoundNFT from "./SoundNFT";
 
export default function Footer() {
  return (
      <>
        <Flex
            display="column"
            align="center"
            justify="center"
            height="10vh"
            mb="5vh"
            transition="all 0.3s ease-out"
        >
            
            <Stack
              w="100%"
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
                </Flex>
                <Text fontSize="0.75rem" >All rights reserved ©CardanoSounds</Text>
            </Stack> 
                
                
        </Flex>
      </>
  )
}