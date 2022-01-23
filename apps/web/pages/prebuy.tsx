import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import React from "react"
import PreBuy from '../components/PreBuy'

export default function Prebuy(){
    
    return (
        <>
        
            <Layout>

                <Head>
                    <title>How to buy Cardano Sounds NFT</title>
                </Head>
                
                <PreBuy/>

            </Layout>
        
        </>
    )

}