import Head from 'next/head'
import Layout from '../components/layout'
import React from "react"
// import BuyComp from '../components/Buy'
import PreBuy from '../components/PreBuy'

export default function Buy(){
    
    return (
        <>
        
            <Layout>

                <Head>
                    <title>Buy Cardano Sounds NFT</title>
                </Head>
                <PreBuy />
                {/* <BuyComp /> */}

            </Layout>
        
        </>
    )

}