import React from "react"
import NextChakraLink from './NextChakraLink'
import {
  Box,
  Button,
  Flex,
  Image,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react"
 
export default function Hero() {
  return (

        <Flex
          align="center"
          justify="center"
          // justify={{ base: "center", md: "space-around", xl: "space-between" }}
          direction={{ base: "column-reverse", md: "row" }}
          minH="100vh"
        >
          <Stack
            spacing={2}
            w={{ base: "80%", md: "50%" }}
            align={["center", "center", "flex-start", "flex-start"]}
          >
            <Heading
              as="h1"
              size="xl"
              textAlign={["center", "center", "left", "left"]}
            >
              Cardano Sounds
            </Heading>
            <Heading
              as="h1"
              size="xl"
              textAlign={["center", "center", "left", "left"]}
            >
              NFT
            </Heading>
            <NextChakraLink 
              href="/" 
            >
                <Button
                  borderRadius="8px"
                  py={4}
                  lineHeight={0.75}
                  size="md"
                  aria-label="Get NFT"
                >Get yours!</Button>
            </NextChakraLink>
          </Stack>

          <Box w={{ base: "80%", sm: "60%", md: "40%" }} mb={{ base: 0, md: 0 }} mt={{ base: 6, md: 0 }}>
            <Image src="/cardanosounds1.svg" size="100%" rounded="50%" shadow="2xl" />
          </Box>

        </Flex>

  )
}
 