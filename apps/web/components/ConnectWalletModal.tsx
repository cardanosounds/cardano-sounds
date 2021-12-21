
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
  ModalFooter
} from "@chakra-ui/react"


export default function ConnectWalletModal(
    isOpen: boolean, 
    onClose: () => void, 
    isDark: boolean, 
    walletEnabled: boolean, 
    enableCardano: (wallet?: string) => Promise<void>) {
  return <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />

    <ModalContent
      backgroundColor={isDark ? ("gray.800") : ("white")}
      background="transparent url(/noise.png) repeat 0 0">
      <ModalHeader>Connect wallet</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        {walletEnabled ?
          <Text>...Connected</Text>
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
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}

