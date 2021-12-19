
import {
  Button,
  Text,
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
      </ModalBody>
      <ModalFooter>
        <Button variant={'ghost'} mr={3} onClick={() => enableCardano()}>
          Connect Nami
        </Button>
        <Button variant={'ghost'} mr={3} onClick={() => enableCardano('ccvault')}>
          Connect ccvault
        </Button>
        <Button onClick={onClose}>Close</Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
}
