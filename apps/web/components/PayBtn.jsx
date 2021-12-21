import {
    Box,
    Button,
    Spinner,
    Text,
    useToast,
    useDisclosure, 
    Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useColorMode 
  } from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import WalletJs from "../wallet-js";
import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import WalletContext from "../lib/WalletContext";
import { MdAccountBalanceWallet } from 'react-icons/md';
import ConnectWalletModal from './ConnectWalletModal'
  
  
  let wallet
  const PayBtn = (successCallback) => {
    const toast = useToast()
    const walletCtx = useContext(WalletContext)
    const { colorMode } = useColorMode()
    const isDark = colorMode === 'dark'
    const { isOpen, onOpen, onClose } = useDisclosure()
    const [connected, setConnected] = useState("")
    const [loading, setLoading] = useState(false)
    const walletModal = useDisclosure()
  
    const init = async () => {
      wallet = new WalletJs(
        "https://cardano-mainnet.blockfrost.io/api/v0",
        "mainnetGHf1olOJblaj5LD8rcRudajSJGKRU6IL",
        walletCtx.walletApi
      )
      setConnected(window.localStorage.getItem('cswallet') === 'connected')
    }

    const enableCardano = async (wallet = 'nami') => {
      if(!window.cardano) return

      let baseWalletApi, fullWalletApi
      switch(wallet){
        case 'nami':
          baseWalletApi = window.cardano
          break
        case 'ccvault':
          baseWalletApi = window.cardano.ccvault
          break
      }
      switch(wallet){
        case 'nami':
          await baseWalletApi.enable()
          fullWalletApi = window.cardano
          break
        case 'ccvault':
          fullWalletApi = await baseWalletApi.enable()
          break
      }
      if(!await baseWalletApi.isEnabled()) return

      walletCtx.update({walletApi: fullWalletApi})
      window.localStorage.setItem('cswallet', 'connected')
      walletModal.onClose()
    }

    const checkStatus = async (toast, connected) => {
      connected = walletCtx.walletApi !== null
      wallet.walletApi = walletCtx.walletApi
      setConnected(connected)
      return (
        NoWallet(toast) &&
        (await NotConnectedToast(toast, connected)) &&
        (await WrongNetworkToast(toast))
      )
    }
  
    const makeTx = async (payTo, payAdaAmount) => {
      setLoading(true)
     
      const tx = await wallet
        .payTx(
          payTo,
          payAdaAmount
        )
        .catch((e) => {
          console.log(e);
          FailedTransactionToast(toast);
          setLoading(false);
        });
      if (!tx) return;
      const signedTx = await wallet.signTx(tx).catch(() => setLoading(false));
      if (!signedTx) return;
      const txHash = await wallet.submitTx(signedTx);
      if(txHash.toString().length === 64){
        PendingTransactionToast(toast);
        await wallet.awaitConfirmation(txHash);
        toast.closeAll();
        SuccessTransactionToast(toast, txHash, onclose, successCallback);
        setLoading(false);
        console.log(txHash);

      } else {
        console.log("error")
        await TxErrorSubmitToast(toast);
        setLoading(false);
      }
    };

    const SuccessTransactionToast = (toast, txHash) => {
      toast({
        position: "bottom-right",
        title: (
          <Box display="flex" alignItems="center">
            <Text>Transaction confirmed</Text>
            <ExternalLinkIcon
              cursor="pointer"
              ml="4"
              onClick={() =>
                window.open(`https://cardanoscan.io/transaction/${txHash}`)
              }
            />
          </Box>
        ),
        status: "success",
        duration: 9000,
      });
      onClose()
      successCallback.successCallback(txHash)
    };
    
    useEffect(() => {
      init();
    }, []);
    useEffect(() => {
      if (connected)
        window.cardano.onAccountChange(async () => {
          const address = await wallet.baseAddressToBech32();
          setConnected(address);
        });
    });
    return (
      <Box
        h="100%" w="100%"
      >       
      <Button onClick={onOpen} variant={"ghost"} h="100%" w="100%">PAY <MdAccountBalanceWallet/></Button>
      {ConnectWalletModal(walletModal.isOpen, walletModal.onClose, isDark, walletCtx.walletApi !== null, enableCardano)}

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          backgroundColor={isDark ? ("gray.800") : ("white")}
          background="transparent url(/noise.png) repeat 0 0"
        >
          <ModalHeader><Text fontWeight="bold" fontSize="36" mb={4}>
              Pay with with a Dapp connector wallet
            </Text></ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Button
              my="auto"
              onClick={async () =>
                (await checkStatus(toast, connected)) && makeTx(
                  'addr1qx8p9zjyk2us3jcq4a5cn0xf8c2ydrz2cxc5280j977yvc0gtg8vh0c9sp7ce579jhpmynlk758lxhvf52sfs9mrprws3mseux',
                   1)
              }
              width="200px"
              isLoading={loading}
              variant="ghost"
            >
              Pay
            </Button>
            <Button
              my="auto"
              width="200px"
              onClick={walletModal.onOpen}
              variant="ghost"
            >Connect</Button>
          </ModalBody>

          <ModalFooter>
            <Button variant='ghost' onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
    );
  };
  
  const NoWallet = (toast) => {
    if (window.cardano) return true;
    toast({
      position: "bottom-right",
      title: (
        <Box width="full" display="flex">
          <Text>No wallet installed</Text>
          <Button
            onClick={() => window.open("https://namiwallet.io")}
            ml="6"
            mr="-4"
            size="xs"
            color="orange.400"
            rightIcon={<ChevronRightIcon />}
          >
            Get Nami
          </Button>
          <Button
            onClick={() => window.open("https://ccvault.io")}
            ml="6"
            mr="-4"
            size="xs"
            color="orange.400"
            rightIcon={<ChevronRightIcon />}
          >
            Get ccvault
          </Button>
        </Box>
      ),
  
      status: "warning",
      duration: 9000,
    });
    return false;
  };

  const TxErrorSubmitToast = async (toast) => {
    toast({
      position: "bottom-right",
      title: "Transaction submit failed",
      description: "Try again or use a wallet with enough ADA not locked with UTXOs, and only a small amount of native assets.",
      status: "error",
      duration: 5000,
    });
    return false;
  };
  
  const WrongNetworkToast = async (toast) => {
    console.log(await window.cardano.getNetworkId());
    if ((await window.cardano.getNetworkId()) === 1) return true;
    toast({
      position: "bottom-right",
      title: "Wrong network",
      status: "warning",
      duration: 5000,
    });
    return false;
  };
  
  const NotConnectedToast = async (toast, connected) => {
    if (connected) return true;
    toast({
      position: "bottom-right",
      title: "Connect a wallet first",
      status: "warning",
      duration: 5000,
    });
    return false;
  };
  
  const FailedTransactionToast = (toast) => {
    return toast({
      position: "bottom-right",
      title: "Transaction not possible",
      description: "(Maybe insufficient balance)",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };
  
  const PendingTransactionToast = (toast) => {
    toast({
      position: "bottom-right",
      title: (
        <Box display="flex" alignItems="center">
          <Text>Transaction pending</Text>
          <Spinner ml="4" speed="0.5s" size="sm" />
        </Box>
      ),
      status: "info",
      duration: null,
    });
  };
    
  export default PayBtn;
  