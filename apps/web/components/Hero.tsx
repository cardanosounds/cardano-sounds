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
  useColorMode,
} from "@chakra-ui/react"
 
export default function Hero() {
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (

        <Flex
          align="center"
          justify="center"
          bgColor={isDark ? ("gray.900") : ("gray.50")}
          // justify={{ base: "center", md: "space-around", xl: "space-between" }}
          direction={{ base: "column-reverse", md: "row" }}
          minH="85vh"
        >
          <Stack
            spacing={2}
            w={{ base: "80%", md: "40%" }}
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
          {/*
         
          */}
          <Box  w={{ base: "80%", sm: "60%", md: "50%" }} mb={{ base: 0, md: 0 }} mt={{ base: 6, md: 0 }}>
           {/*<Image src="/new-logo.svg" size="100%" rounded="50%" shadow="2xl" /> */}
           <Image src="/new-logo-big.svg" size="100%" />
          </Box>

        </Flex>

  )
}
 