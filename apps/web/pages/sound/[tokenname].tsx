import Head from "next/head";
import React from "react";
import Layout from "../../components/layout";
import SoundNFT from "../../components/SoundNFT";
import { NFTData } from "../../interfaces/interfaces";


export default function Sound({nftData}: {nftData?: NFTData})
{
    
        return (
            <>
            <Layout>
                <Head>
                    <title>Cardano Sounds NFT - {nftData?.id}</title>
                </Head>
                <SoundNFT nftData={nftData} />

            </Layout>
            </>
	    )
}

export const getServerSideProps = async (context) => {
    // ...
    const { tokenname } = context.query

    let data: NFTData = {
        amount: [{quantity: 25000000, unit: "lovelace"}],
        id: "CSNFT1",
        output_Index: 0,
        senderAddress: "addr112233334444555666678777788888999911100000",
        metadata: {
            arweave_id_sound: "hjdf92o3heohdj293hjo2hij3hj0pihjn09",
            ipfs_id_sound: "ipfs://",
            image: "ipfs://",
            player: "randomdancers-light",
            id: "CSNFT1",
            probability: 0.001,
            rarity: "",
            sounds: [
                {category: "enrichment", probability: 0.01, filename: "sound1"},
                {category: "melody", probability: 0.01, filename: "sound2"},
                {category: "bass", probability: 0.01, filename: "sound3"},
                {category: "enrichment", probability: 0.01, filename: "sound4"},
                {category: "enrichment", probability: 0.01, filename: "sound5"}
            ],
            token_name: "CSNFT1",
            arweave_website_uri: ""        
        },
        status: "done",
        tx_Hash: "poj32ohjdf92o3heohdj293hjo2hij3hj0pihjn09o3hdoihwohj02",
        created: "8/4/2021 10:00pm"
    }

    //data = await fetch("/api/sound/" + tokenname).then(res => res.json())
    
    return {
        props: {nftData: data}
    }
}