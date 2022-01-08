import Head from "next/head";
import React from "react";
import Layout from "../../components/layout";
import SoundNFT from "../../components/SoundNFT";
import { DatabaseTx, Metadata } from "../../interfaces/databaseTx";

const apiPath = "/api/"

export default function Sound({nftData}: {nftData?: Metadata})
{
    
        return (
            <>
            <Layout>
                <Head>
                    <title>Cardano Sounds NFT - {nftData?.token_name}</title>
                </Head>
                <SoundNFT nftData={nftData} />
            </Layout>
            </>
	    )
}

export const getServerSideProps = async (context) => {
    // ...
    const { tokenname } = context.query
    let data
    const res = await fetch(apiPath + "sound/" + tokenname).then(res => res.json())
    if(Array.isArray(res)) {
        data = res[0].Metadata
    } else {
        data = res
    }
    return {
        props: {nftData: data }
    }
}