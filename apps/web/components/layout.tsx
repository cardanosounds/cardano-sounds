import Head from 'next/head'
import { Flex, useColorModeValue, Text, IconButton } from '@chakra-ui/react'
import mainStyles from './layout.module.css'
import Logo from './Logo';
import DarkModeSwitchMenu from './DarkModeSwitchMenu';

export const siteTitle = 'Cardano Sounds NFT'

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  const color = useColorModeValue("gray.900", "gray.50")
  return (
    <Flex
      direction="column"
     // align="top"
      w="100vw"
      minH="100vh"
      //background="linear-gradient(90deg, rgba(26,32,44,1) 0%, rgba(45,55,72,1) 100%), linear-gradient(90deg, rgba(247,250,252,1) 0%, rgba(237,242,247,1) 100%)"
      //backgroundPosition="top, bottom"
     // backgroundSize="100vw 10vw, 100vw 80vw"
      //minH="100%"
      m="0 auto"
    >
      <div className={mainStyles.container}>
        <Head >
          <link rel="icon" href="/card-wave2.svg" />
          <meta
            name="description"
            content="Get music clip NFT with original sound on Cardano blockchain!"
          />
          <meta
            property="og:image"
            content="https://cryptologos.cc/logos/cardano-ada-logo.svg?v=010"
          />
          <meta name="og:title" content={siteTitle} />
          <meta name="twitter:card" content="summary_large_image" />
        </Head>
        <header  className={mainStyles.header}>
          
          <Flex direction="row" className={mainStyles.stickyNav}>
              <IconButton 
                    align="flex-start"
                    //50vw 5vh
                    margin={["7vh 50vw 0 0", "7vh 60vw 0 0", "0em 0.5em 0.25em 3em", "2.5em 0.5em 0.25em 4em", "4em 0.5em 0.25em 6em",  "0em 0.5em 0.25em 11em"]}
                    aria-label="Cardano Sounds home"
                    variant="ghost"
                    size="lg"
                    icon={<Logo color={ color } />}
                    display={["flex", "flex", "none", "none", "none", "none"]}
                    onClick={ () => {} }
                    transition="all 0.3s ease-in-out"
                  />
              <DarkModeSwitchMenu />
          </Flex>
        </header>
          <main >{children}</main>
          <Text 
            left="0"
            bottom={{ base: "3vh", md: "5vh"}}
            position="fixed"
            right="0"
            textAlign="center" 
            fontSize={{ base: "0.65rem", md: "1.125rem" }}
            fontFamily="Share Tech Mono, monospace"
            transition="all 0.3s ease-in-out"
          >ALL RIGHTS RESERVED ©CARDANOSOUNDS
          </Text>
      </div>
    </Flex>

  )
}
