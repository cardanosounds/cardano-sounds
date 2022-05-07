
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
import { useEffect, useState } from "react"
import MiddleEllipsis from "react-middle-ellipsis";
import { useStoreState } from "../store"
import { WalletProvider } from "lucid-cardano"

export default function ConnectWalletModal(
  isOpen: boolean,
  onClose: () => void,
  isDark: boolean,
  enableCardano: (wallet?: string) => Promise<void>) {
  const [walledAddress, setWalletAddress] = useState<string>('')
  const walletStore = useStoreState(state => state.wallet)

  const loadWalletSession = async () => {
    if (walletStore.connected &&
      walletStore.name &&
      window.cardano &&
      (await window.cardano[walletStore.name].enable())
    ) {
      const { Lucid, Blockfrost } = await import('lucid-cardano')

      await Lucid.initialize(
        'Testnet',
        new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
      )
      await Lucid.selectWallet(walletStore.name as WalletProvider)
      setWalletAddress(Lucid.wallet.address)
    }
  }

  useEffect(() => {
    loadWalletSession();
  }, [walletStore])

  
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />

      <ModalContent
        backgroundColor={isDark ? ("gray.800") : ("white")}
        background="transparent url(/noise.png) repeat 0 0">
        <ModalHeader><Heading as='h3'>Connect wallet</Heading></ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {walletStore.connected ?
            <Flex w="80%" direction="row">Connected: <MiddleEllipsis><p>{walledAddress}</p></MiddleEllipsis></Flex>
            : <></>}
          <Flex direction="column" mx="auto" w="90%">
            <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano()}>
              <Image src="/icons/Nami-icon.svg" w="48px" h="48px" />Connect Nami
            </Button>
            <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano('ccvault')}>
              <Image src="/icons/ccvault-icon.png" w="48px" h="48px" />Connect ccvault
            </Button>
            <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano('flint')}>
              <Image src="/icons/flint-icon.png" w="48px" h="48px" />Connect flint
            </Button>
            {/* <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano('yoroi')}>
              <Image src="/icons/yoroi-icon.png" w="48px" h="48px" />Connect Yoroi
            </Button>
            <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano('gerowallet')}>
              <Image src="/icons/gerowallet-icon.png" w="48px" h="48px" />Connect GeroWallet
            </Button>
            <Button w="100%" h={24} variant={'ghost'} mr={3} onClick={() => enableCardano('cardwallet')}>
              <Image src="/icons/cardwallet-icon.png" w="48px" h="48px" />Connect CardWallet
            </Button> */}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>CLOSE</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

