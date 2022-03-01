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
    const saleDateString = "2022-02-24 20:00:00 GMT+0100"
    const saleEndDateString = "2022-02-25 20:00:00 GMT+0100"
    const saleDate =  new Date(saleDateString) 
    const saleEndDate =  new Date(saleEndDateString) 

    const dt = new Date()
    const addr = process.env.SALE_ADDRESS || "";
    const price = process.env.SALE_PRICE || 0;
    let data
  
    if(dt.getTime() > saleDate.getTime() && dt.getTime() < saleEndDate.getTime()) {
      data = { status: "open", address: addr, price: price }
    } else {
      data = { status: "wait", datetime: saleDateString }
    }

    return {
        props: {
            data
        }
    }
}
