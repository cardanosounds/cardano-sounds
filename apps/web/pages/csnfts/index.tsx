import Error from 'next/error'

import { GetServerSideProps } from 'next'
import {
  Flex,
  SimpleGrid,
  Select,
  Button,
} from "@chakra-ui/react"
import { useState } from 'react'
import { SoundListData } from '../../interfaces/interfaces'
import Head from "next/head"
import Layout from "../../components/layout"
import SoundNFTPreviewSmall from "../../components/SoundNFTPreviewSmall"
import { ChevronDownIcon } from "@chakra-ui/icons"
import { Metadata } from "@prisma/client"

export default function SoundList({ errorCode, data }: {
    errorCode: number
    data: SoundListData
})
{
  const [ collection, changeCollection ] = useState<string>("all")
  const [ sort, setSort ] = useState<string>("default")
  const [ nfts, updateNfts ] = useState<Metadata[]>(data.nfts)
  const [ loadingMore, loadMore ] = useState<boolean>(false)

  const changeSortOption = async (selectedIndex: number) => {
    console.log('changeSortOption index ' + selectedIndex)
    let selection = 'default'
    switch(selectedIndex){
      case 1:
        selection = 'asprobability'
        break
      case 2:
        selection = 'deprobability'
        break
      case 3:
        selection = 'asid'
        break
      case 4:
          selection = 'deid'
    }
    console.log('selection: ' + selection)
    if(selection == sort) return
    setSort(selection)
    const res: SoundListData = await fetch(`/api/csnfts/${collection}/${selection}/1`).then(rs => rs.json())
    updateNfts(res.nfts)   
  }

  const changeCollectionOption = async (selectedIndex: number) => {
    console.log('changeCollectionOption index ' + selectedIndex)
    let selection: string = "wave"
    if(selectedIndex == 0)
    {
      selection = "all"
    }
    else 
    {
      selection += selectedIndex
    }
    if(selection == collection) return
    changeCollection(selection)
    const res: SoundListData = await fetch(`/api/csnfts/${selection}/${sort}/1`).then(rs => rs.json())
    updateNfts(res.nfts)   
  }

  const loadNewPage = async () => {
      loadMore(true)
      data.page ++

      const res: SoundListData = await fetch(`/api/csnfts/${collection}/${sort}/` + String(data.page)).then(rs => rs.json())
      console.log(res)

      updateNfts(nfts.concat(res.nfts))
      loadMore(false)
  }

  if (errorCode !== null) {
    return <Error statusCode={errorCode} title="Something is wrong."/>
  }
  else {}
  return (
    <Layout>
      <Head>
        <title>CardanoSounds - NFTs</title>
      </Head>
     <Flex
      display="column"
      align="center"
      justify="center"
      maxW={["95vw", "90vw", "80vw"]}
      minH="60vh"
      mt={["18vh", "17vh", "25vh", "25vh", "20vh"]}
      mx='auto'

    >
      <Flex direction={["column", "column", "row"]} w="85%" mx="auto">
        <Select 
          variant="outline" 
          placeholder="Select collection" 
          ml={["5vw", "2.5vw", "1.5vw"]} 
          mt="3vw" 
          mb={0} 
          onChange={async (e) => await changeCollectionOption(e.target.options.selectedIndex)} 
        >
          <option value="wave1">Wave 1</option>
          <option value="wave2">Wave 2</option>
          <option value="wave3">Wave 3</option>
        </Select>
        <Select 
          variant="outline" 
          placeholder="Select sort" 
          mt="3vw" ml={["5vw", "2.5vw", "1.5vw"]} 
          mb={0} 
          onChange={async (e) => await changeSortOption(e.target.options.selectedIndex)} 
        >
          <option value="asprobability">Probability ↑</option>
          <option value="deprobability">Probability ↓</option>
          <option value="asid">Id ↑</option>
          <option value="deid">Id ↓</option>
        </Select>
      </Flex>
      <Flex
        align="center"
        align-items="center"
        justify-content="center"
        direction={'column'}
        m='0'
      >
        <SimpleGrid w="85%" spacing={["1vh", "1vh", "1vw"]} 
          overflow-x="auto"
          columns={[1,1,2,3]}
        >
          { nfts.map(( nftsound: Metadata ) => (
            <SoundNFTPreviewSmall  metadata={nftsound}/>
          ))}
        </SimpleGrid>
        <Button isLoading={loadingMore} display="flex" variant={"ghost"} mx="auto" title="Load more" onClick={loadNewPage}><ChevronDownIcon/></Button>
       </Flex>
    </Flex>
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
    // ...
    let errorCode: number = null;

    const prisma = await import('../../lib/prisma')

    let data: SoundListData

    if (errorCode === null) {
      const nftListData = await prisma.default.metadata.findMany({
        skip: 0,
        take: 9
      })
      
      if(!nftListData) {
        data = {
          collection: "all",
          page: 1,
          nfts: []
        }
      }
      else {
        data = 
        {
            collection: 'all',
            page: Number(1),
            nfts: nftListData
        }
      }
    }
    else {
        data = {
            collection: "all",
            page: 1,
            nfts: []
        }
    }
    
    return {
        props: {
          errorCode,
          data
        },
    }
}
