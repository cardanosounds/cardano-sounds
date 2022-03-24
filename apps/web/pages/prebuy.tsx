// import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import React from "react"
import dynamic from 'next/dynamic';
// import PreBuy from '../components/PreBuy'
const Comp = dynamic(() => import("../components/TestButton"),
  { ssr: false }
);
export default function Prebuy(){
    
    return (
        <>
        
            <Layout>

                <Head>
                    <title>How to buy Cardano Sounds NFT</title>
                </Head>
               <Comp/>
                
                {/* <PreBuy/> */}

            </Layout>
        
        </>
    )

}