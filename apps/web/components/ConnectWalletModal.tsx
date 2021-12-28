
import {
  Button,
  Text,
  Image,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading
} from "@chakra-ui/react"
import loader from "../wallet-js/loader"
import WalletContext from "../lib/WalletContext"
import { useContext, useEffect, useState } from "react"
import { Buffer } from 'buffer'
import MiddleEllipsis from "react-middle-ellipsis";

const _Buffer = Buffer

export default function ConnectWalletModal(
    isOpen: boolean, 
    onClose: () => void, 
    isDark: boolean, 
    walletEnabled: boolean, 
    enableCardano: (wallet?: string) => Promise<void>) {
    const walletCtx = useContext(WalletContext)
    const [walledAddress, setWalletAddress] = useState<string>('')

    useEffect(() => {
        addressToBech32();
    }, [walletCtx])

    const addressToBech32 = async () => {
      // console.log(walletCtx.walletApi)
      if(walletCtx.walletApi) {
          await loader.load()
          const address = (await walletCtx.walletApi.getUsedAddresses())[0]
          const addReadable = loader.Cardano.Address.from_bytes(_Buffer.from(address, 'hex')).to_bech32()
          console.log(addReadable)
          setWalletAddress(addReadable)
      }
  }
  return (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />

    <ModalContent
      backgroundColor={isDark ? ("gray.800") : ("white")}
      background="transparent url(/noise.png) repeat 0 0">
      <ModalHeader><Heading as='h3'>Connect wallet</Heading></ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {walletEnabled ?
          <Flex w="80%" direction="row">Connected: <MiddleEllipsis><p>{walledAddress}</p></MiddleEllipsis></Flex>
          : <></>}
        <Flex direction="column" mx="auto" w="90%">
          <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano()}> 
            <Image src="/icons/Nami-icon.svg" w="48px" h="48px"/>Connect Nami
          </Button>
          <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano('ccvault')}>
            <Image src="/icons/ccvault-icon.png" w="48px" h="48px"/>Connect ccvault
          </Button>
        </Flex>
      </ModalBody>
      <ModalFooter>
        <Button onClick={onClose}>CLOSE</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
  )
}

