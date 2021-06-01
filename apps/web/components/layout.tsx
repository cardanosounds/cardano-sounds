import React, { useState, useEffect } from 'react';
import Head from 'next/head'
import { Flex, useColorModeValue } from '@chakra-ui/react'
import Image from 'next/image'
import mainStyles from './layout.module.css'
import utilStyles from '../styles/utils.module.css'
import Link from 'next/link'
import DarkModeSwitch from './DarkModeSwitchMenu'
import StickyNav from "react-sticky-nav";
import Footer from './Footer';

export const siteTitle = 'Cardano Sounds NFT'

export default function Layout({
  children,
  home,
}: {
  children: React.ReactNode
  home?: boolean
}) {
  const color = useColorModeValue("gray.50", "gray.900")
  return (
    <Flex
      direction="column"
     // align="top"
      w="100vw"
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
          <StickyNav className={mainStyles.stickyNav}>
            <DarkModeSwitch />
          </StickyNav>
        </header>
          <main >{children}</main>
        {!home && (
          <div className={mainStyles.backToHome}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
        )}

      </div>
      <Flex 
        justify="center"
        align="bottom"
        bgColor={color}
        w="100vw"
        position="relative"
        bottom="0"
        left="0"
        right="0"
        z-index="0"
      >
        <Footer></Footer>
      </Flex>

    </Flex>

  )
}
