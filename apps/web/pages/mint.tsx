import dynamic from "next/dynamic";
import { Flex } from '@chakra-ui/react';
import Layout from '../components/layout';

const MintComp = dynamic(() => import("../components/Mint.jsx"),
  { ssr: false }
);

export default function Mint() {
    
    return (
        <Layout>
            <Flex align="center" justify="center" minH="85vh" w="100vw">
                <MintComp></MintComp>
            </Flex>
        </Layout>
    )
}