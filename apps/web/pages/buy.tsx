import Head from 'next/head'
import Layout from '../components/layout'
import React, { useEffect } from "react"
import PreBuy from '../components/PreBuy'
import BuyComp from '../components/Buy'
import { GetServerSideProps } from 'next'

export default function Buy(data){
    useEffect(() => console.log(data), [data])
    return (
        <>
        
            <Layout>

                <Head>
                    <title>Buy Cardano Sounds NFT</title>
                </Head>
                {data.data.status == "open" ? 
                    <BuyComp data={data.data}/>
                :
                    <PreBuy data={data.data} />
                } 

            </Layout>
        
        </>
    )

}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const saleDate =  new Date("2022-02-17 20:00:00 GMT+0100") 

    const dt = new Date()
    const addr = process.env.SALE_ADDRESS || "";
    const price = process.env.SALE_PRICE || 0;
    let data
    console.log("dt.getTime()")
    console.log(dt.getTime())
    console.log("saleDate.getTime()")
    console.log(saleDate.getTime())
    if(dt.getTime() > saleDate.getTime()) {
      data = { status: "open", address: addr, price: price }
    } else {
      data = { status: "wait", datetime: "2022-02-24 19:00:00 GMT+0100" }
    }

    return {
        props: {
            data
        }
    }
}
