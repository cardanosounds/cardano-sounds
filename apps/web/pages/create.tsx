import { Button, Flex, Heading, Text } from '@chakra-ui/react'
import { RiFileMusicLine } from 'react-icons/ri';//FaFileAudio
import { RiSoundModuleFill } from 'react-icons/ri';
import { RiArtboardLine } from 'react-icons/ri';//MdDesignServices
import { FaFileImage } from 'react-icons/fa';//MdDesignServices
//import p5 from 'p5'
import dynamic from "next/dynamic";
import Layout from '../components/layout';
import NextChakraLink from '../components/NextChakraLink';

const P5Comp = dynamic(() => import("../components/p5sequencer"),
  { ssr: false }
);

export default function Create() {
    
    return (
        <Layout>
                {/* <P5Comp size={{width:300, height:300}} isDark={isDark} /> */}
          <Flex direction="row" w="70vw" h="80vh" pt="20vh" mx="auto">
            <Flex direction="column" w="100%" h="100%">
              <Flex w="100%" h="100%" p={2} direction="column" textAlign={"center"}>
                <NextChakraLink href={'/create'} w="100%" h="100%">
                  <Button variant={"ghost"} w="100%" h="100%">CREATE <RiSoundModuleFill/></Button>
                </NextChakraLink>
                {/* <Text mx="auto">OR</Text> */}
              </Flex> 
              <Flex w="100%" h="100%" direction="column"  p={2} textAlign={"center"}>
                <Button variant={"ghost"}  w="100%" h="100%" disabled>USE<RiFileMusicLine/></Button>
                {/* <Text mx="auto">SOUND</Text> */}
              </Flex>
            </Flex> 
            <Flex direction="column" w="100%" h="100%">
              <Flex w="100%" h="100%" direction="column" p={2} textAlign={"center"}>
                <Button variant={"ghost"} w="100%" disabled h="100%">CREATE <RiArtboardLine/></Button>

              </Flex> 
              <Flex w="100%" h="100%" p={2} direction="column" textAlign={"center"}>
                <Button variant={"ghost"}  w="100%" h="100%" disabled>USE <FaFileImage/></Button>

              </Flex>
            </Flex>
            {/* <P5Comp/> */}
          </Flex> 
        </Layout>
    )
}