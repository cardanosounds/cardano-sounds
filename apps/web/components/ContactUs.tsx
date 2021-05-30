import React from "react"
import NextChakraLink from './NextChakraLink'
import {
  Button,
  Flex,
  Heading,
  Stack,
  IconButton,
  Text,
  Image
} from "@chakra-ui/react"
 
export default function ContacUs() {
  return (
      <>
        <Flex
            display="column"
            align="center"
            justify="center"
        >
            <Stack
              spacing={{ base: 2, md: 6 }}
              w={{ base: "80%", md: "80%" }}
              text-align="center"
              align="center"
              margin="10vh auto"
              horizontal-align="middle"
            >
                <Image src="/cardanosound-coin.svg" size="md" />
                <Text size="xl"
                  textAlign="center"
                >Our goal is to bring more audio artists to NFT space,</Text>

                <Text size="xl"
                  textAlign="center"
                >by building strong community driven platform to trade, collect, create and share non-fungible tokens with audio <a href="https://medium.com">... read more</a></Text>

                <Text
                size="md"
                fontWeight="normal"
                // color="primary.800"
                textAlign="center"
                >
                    Do you want to collaborate, have any good idea, or is there something for us to get better at?
                </Text>
                <Text
                size="md"
                // color="primary.800"
                fontWeight="normal"
                lineHeight={2}
                textAlign="center"
                >
                  Let us know! We value every message.
                </Text>
                <NextChakraLink href="mailto: cardanosounds@gmail.com"
                >
                    <Button
                    borderRadius="8px"
                    py={4}
                    // lineHeight={0.75}
                    size="md"
                    aria-label="email"
                    >Email</Button>
                </NextChakraLink>
            </Stack>

        </Flex>
      </>
  )
}