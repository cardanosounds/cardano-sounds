import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import Layout from "../../components/layout";
import SoundNFTPreview from "../../components/SoundNFTPreview";
import { DatabaseTx, Metadata } from "../../interfaces/databaseTx";
import getSoundNFTData from '../../lib/sounds'

// const apiPath = "http://localhost:3000/api/"
// const apiPath = "https://csounds-app.azurewebsites.net/api/"

export default function Sound({metadata}: {metadata?: Metadata})
{
        return (
            <>
            <Layout>
                <Head>
                    <title>Cardano Sounds NFT - {metadata?.token_name}</title>
                </Head>
                <Flex
                    display="column"
                    align="center"
                    justify="center"
                    maxW={["95vw", "90vw", "80vw"]}
                    minH="60vh"
                    mt={["18vh", "17vh", "25vh", "25vh", "20vh"]}
                    mx="auto"
                >
                    <SoundNFTPreview metadata={metadata}></SoundNFTPreview>
                </Flex>
                {/* <SoundNFT nftData={nftData} /> */}
            </Layout>
            </>
	    )
}

export const getServerSideProps = async (context) => {
    // ...
    const { tokenname } = context.query
    if (typeof(tokenname) === "undefined") return { props: {metadata: "Wrong id"} }
    let data
    const res = await getSoundNFTData(tokenname)
    console.log(res)
    // console.log(res)
    // if(Array.isArray(res)) {
    //     data = res[0].metadata[0]
    //     console.log(data)
    // } else {
    data = res
    // }
    return {
        props: {metadata: data }
    }
}