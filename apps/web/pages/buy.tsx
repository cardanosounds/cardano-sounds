import { useState, useEffect } from 'react'
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import React from "react"
import PreBuy from '../components/PreBuy'

export default function Buy(){
    
    return (
        <>
        
            <Layout>

                <Head>
                    <title>Buy Cardano Sounds NFT</title>
                </Head>
                
                <PreBuy/>

            </Layout>
        
        </>
    )

}