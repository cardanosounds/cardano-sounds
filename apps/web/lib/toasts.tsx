import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    Spinner,
    Text,
  } from "@chakra-ui/react";

export const TxErrorSubmitToast = async (toast) => {
    toast({
        position: "bottom-right",
        title: "Transaction submit failed",
        description: "Try again or use a wallet with enough ADA not locked with UTXOs, and only a small amount of native assets.",
        status: "error",
        duration: 5000,
    });
    return false;
};

export const WrongNetworkToast = async (toast, walletApi) => {
    console.log(await walletApi.getNetworkId());
    if ((await walletApi.getNetworkId()) === 1) return true;
    toast({
        position: "bottom-right",
        title: "Wrong network",
        status: "warning",
        duration: 5000,
    });
    return false;
};

export const NotConnectedToast = async (toast, connected) => {
    if (connected) return true;
    toast({
        position: "bottom-right",
        title: "Connect a wallet first",
        status: "warning",
        duration: 5000,
    });
    return false;
};

export const NftLimitToast = async (toast, nfts) => {
    if (nfts.length <= 10) return true;
    toast({
        position: "bottom-right",
        title: "You can mint 10 NFTs per transaction",
        status: "warning",
        duration: 5000,
    });
    return false;
};

export const FailedTransactionToast = (toast) => {
    return toast({
        position: "bottom-right",
        title: "Transaction not possible",
        description: "(Maybe insufficient balance)",
        status: "error",
        duration: 5000,
        isClosable: true,
    });
};

export const PendingTransactionToast = (toast) => {
    toast({
        position: "bottom-right",
        title: (
            <Box display= "flex" alignItems="center" >
            <Text>Transaction pending</ Text >
        <Spinner ml="4" speed = "0.5s" size = "sm" />
        </Box>
    ),
        status: "info",
            duration: null,
    });
  };

export const SuccessTransactionToast = (toast, txHash) => {
    toast({
        position: "bottom-right",
        title: (
            <Box display= "flex" alignItems="center" >
                <Text>Transaction submitted, it might take a while before it will be propagated onto the blockchain.</ Text >
                <ExternalLinkIcon
                    cursor="pointer"
                    ml = "4"
                    onClick = {() =>
                        window.open(`https://cardanoscan.io/transaction/${txHash}`)
                    }
                />
            </Box>
        ),
        status: "success",
        duration: 9000
    });
};

export const NoWalletToast = (toast) => {
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
            // background="white"
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
            // background="white"
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