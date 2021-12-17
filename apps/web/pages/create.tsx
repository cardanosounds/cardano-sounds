import { Flex, Text } from '@chakra-ui/react'

//import p5 from 'p5'
import dynamic from "next/dynamic";
import Layout from '../components/layout';

const P5Comp = dynamic(() => import("../components/p5sequencer"),
  { ssr: false }
);

export default function Create() {
    
    return (
        <Layout>
                {/* <P5Comp size={{width:300, height:300}} isDark={isDark} /> */}
          <Flex minH="70vh">     
            <P5Comp/>
          </Flex> 
        </Layout>
    )
}