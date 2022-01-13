import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import React from "react";
import Layout from "../../components/layout";
import SoundNFT from "../../components/SoundNFT";
import SoundNFTPreview from "../../components/SoundNFTPreview";
import { DatabaseTx, Metadata } from "../../interfaces/databaseTx";

const apiPath = "http://localhost:3000/api/"

export default function Sound({nftData}: {nftData?: DatabaseTx})
{
    
        return (
            <>
            <Layout>
                <Head>
                    <title>Cardano Sounds NFT - {nftData?.Metadata.token_name}</title>
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
                    <SoundNFTPreview nftData={nftData}></SoundNFTPreview>
                </Flex>
                {/* <SoundNFT nftData={nftData} /> */}
            </Layout>
            </>
	    )
}

export const getServerSideProps = async (context) => {
    // ...
    const { tokenname } = context.query
    let data
    const res = await fetch(apiPath + "sound/" + tokenname).then(res => res.json())
    // console.log(res)
    if(Array.isArray(res)) {
        data = res[0]
    } else {
        data = res
    }
    return {
        props: {nftData: data }
    }
}