import { Flex, Heading, List, ListIcon, ListItem, Image, Spacer } from '@chakra-ui/react';
import Layout from '../components/layout';


export default function Mint() {
    
    return (
        <Layout>
            <Flex align="center" direction="column" justify="center" minH="85vh" maxW="50rem" mt="15vh" mx="auto">
            <Heading>Info about mainnet dapp connector minting</Heading>

                <List spacing={3} pl="3vw" ml="0" marginInlineEnd="auto" mt="5vh" >
                    <ListItem>
                        <Image mx="auto" src="/how-to-mint.gif"/>
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                        To use this tool, you need to store your files on <strong>IPFS</strong> and preferably also <strong>Arweave</strong>
                    </ListItem>
                    <Spacer/>
                    <ListItem>
                            For <a href="https://ipfs.io">IPFS</a> you can use service like <a href="https://www.pinata.cloud/">pinata.cloud</a>
                    </ListItem>
                    <ListItem>
                            Arweave - to try it out, you can tweet for confirmation and get little bit for free at <a href="https://arweave.org">arweave.org</a> <br/>
                            To upload, you can use this dApp: <a href="https://arweave.net/PXhr5EdWuCgUmSBbuiU587GlBnmde1MdvlPCpIt1NyM">arweave.net/PXhr5EdWuCgUmSBbuiU587GlBnmde1MdvlPCpIt1NyM</a>
                    </ListItem>
                    <ListItem>
                        All fees go to network. If you want to support the development of this and more tools, you can tip some ADA to addr1qx0l7rcp9qkzyy53w5wkk55wgz0hpmst00revasatvrz3evp5y5y0lja4ujq7geynu5as5fcrtjcdju69pfsvv8hhdpq9ep7x9
                    </ListItem>
                    <Spacer/>                   
                    <a href="/mint">Go to mint</a>
                </List>
            </Flex>
        </Layout>
    )
}