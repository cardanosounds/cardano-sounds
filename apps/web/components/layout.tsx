import Head from 'next/head'
import { Flex, useColorModeValue, Text, IconButton, Spacer } from '@chakra-ui/react'
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

  const currentDate = new Date(); 
  const currentYear = currentDate.getFullYear(); 

  return (
    <Flex
      direction="column"
     // align="top"
      w="100vw"
      h="100vh"
      m="0"
    >
      <div className={mainStyles.container}>
        <Head >
          <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#1a202c" />
          <meta name="apple-mobile-web-app-title" content="Cardano Sounds"/>
          <meta name="application-name" content="Cardano Sounds" />
          <meta name="msapplication-TileColor" content="#1a202c" />
          <meta name="theme-color" content="#f7fafc"></meta>
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
        <header className={mainStyles.header}>
          
          <Flex direction="column" className={mainStyles.stickyNav}>
              
              <DarkModeSwitchMenu home={home} />
          </Flex>
        </header>
          <main >{children}</main>
          <div className={mainStyles.bg} />
          <Spacer />
          <Text 
            left="0"
            bottom="0vh"
            //position={home ? "fixed" : "initial"}
            my="5vh"
            right="0"
            textAlign="center" 
            fontSize={{ base: "0.5rem", md: "0.65rem" }}
            fontFamily="Share Tech Mono, monospace"
            transition="all 0.3s ease-in-out"
          >{currentYear} &copy;CARDANOSOUNDS, ALL RIGHTS RESERVED
          </Text>
      </div>
    </Flex>

  )
}
