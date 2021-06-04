import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

import { Flex, Stack } from '@chakra-ui/react'
import Hero from '../components/Hero'

export default function Home() {
  return (
    <>
      <Stack 
      as="main"
      align="center" 
      >
        <Flex 
          flexDirection="column"
        >
          <Layout home>
            <Head>
              <title>{siteTitle}</title>
            </Head>
            <Hero></Hero>
          </Layout>
        </Flex>
      </Stack>
    </>
  )
}
