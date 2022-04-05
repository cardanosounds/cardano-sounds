import { Flex, Heading } from "@chakra-ui/react";
import Layout from "../components/layout";

export default function Custom404() {
  return (
    <Layout>
      <Flex align="center" justify="center" minH="85vh" mt="15vh" m="0">
        <Heading>We couldn't find what you were looking for 😨</Heading>
      </Flex>
    </Layout>
  )
}

