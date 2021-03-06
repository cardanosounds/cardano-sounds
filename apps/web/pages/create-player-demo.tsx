import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'

import { Flex, Stack } from '@chakra-ui/react'
import dynamic from 'next/dynamic';
const P5Comp = dynamic(() => import("../components/playerColors.jsx"),
  { ssr: false }
);

export default function CreatePlayerDemo() {
  return (
    <>
      <Stack 
      as="main"
      align="center" 
      >
        <Flex 
          flexDirection="column"
        >
          <Layout>
            <Head>
              <title>{siteTitle}</title>
            </Head>

            <P5Comp /> 
          </Layout>
        </Flex>
      </Stack>
    </>
  )
}
