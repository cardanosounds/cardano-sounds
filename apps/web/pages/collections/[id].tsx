import Layout from '../../components/layout'
import { getAllCollectionsIds, getCollectionData } from '../../lib/collections'
import Head from 'next/head'
import Date from '../../components/date'
import utilStyles from '../../styles/utils.module.css'
import { GetStaticProps, GetStaticPaths } from 'next'
import {
    Image,
    Stack,
    Box,
    Flex
  } from "@chakra-ui/react"


export default function Collection({
  collectionData
}: {
    collectionData: {
    title: string
    date: string
    image: string
    contentHtml: string
  }
}) {
  return (
    <Layout>

      <Head>
        <title>{collectionData.title}</title>
      </Head>

      <Flex
        align="center"
        justify="center"
        // // justify={{ base: "center", md: "space-around", xl: "space-between" }}
        // // direction={{ base: "column-reverse", md: "row" }}
        direction="column"
        minH="70vh"
        px={{ base: 0, md: 6 }}
        mb={16}
      >
          
         <Box w="100%" mt={{ base: 4, md: 0 }} align="center" >
          <Image src={ collectionData.image } size="100%" rounded="1rem" shadow="2xl" />
        </Box>
        <Stack
          spacing={4}
          w="90%"
          align={["center", "center", "flex-start", "flex-start"]}
        >
          <h1 className={utilStyles.headingLg}>{collectionData.title}</h1>
          <div className={utilStyles.lightText}>
            <Date dateString={collectionData.date} />
          </div>
          <div dangerouslySetInnerHTML={{ __html: collectionData.contentHtml }} />
        </Stack>

      </Flex>

    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = getAllCollectionsIds()
  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const collectionData = await getCollectionData(params.id as string)
  return {
    props: {
        collectionData
    }
  }
}