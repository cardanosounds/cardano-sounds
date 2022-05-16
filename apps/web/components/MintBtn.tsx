import {
  Box,
  Button,
  Input,
  Text,
  useToast,
  Flex,
  CloseAllToastsOptions,
  ToastId,
  UseToastOptions
} from "@chakra-ui/react";
import { useState } from "react";
import { FailedTransactionToast, NotConnectedToast, NoWalletToast, SuccessTransactionToast, TxErrorSubmitToast } from "../lib/toasts";
import { useStoreState } from "../store";
import { createLockingPolicyScript, mintTx } from "../cardano/utils";
import { Assets,  WalletProvider } from "lucid-cardano";

const MintBtn = (data : { ipfsHash : string | null, arweaveHash: string | null, mimeType?: string }) => {
  const toast = useToast()
  const mimeType = data.mimeType ? data.mimeType : 'audio/WAV'
  const walletStore = useStoreState(state => state.wallet)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    image: "",
    name: "",
    metadataName: "",
    quantity: "1",
    author: ""
  })

  const checkStatus = async (toast: { (options?: UseToastOptions): string | number; close: (id: ToastId) => void; closeAll: (options?: CloseAllToastsOptions) => void; update(id: ToastId, options: Pick<UseToastOptions, "title" | "position" | "variant" | "description" | "onCloseComplete" | "duration" | "status" | "render" | "isClosable">): void; isActive: (id: ToastId) => boolean; }, connected: boolean | ((prevState: boolean) => boolean)) => {
    connected = walletStore.connected
    setConnected(connected)
    return (
      NoWalletToast(toast) &&
      (await NotConnectedToast(toast, connected))
    )
  }
  
  const makeTx = async () => {
    setLoading(true)
    try{
      const { Lucid, Blockfrost } = await import('lucid-cardano')
      await Lucid.initialize(
        'Mainnet',
        new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', 'mainnetGHf1olOJblaj5LD8rcRudajSJGKRU6IL')
      )
      await Lucid.selectWallet(walletStore.name as WalletProvider)
      const walletAddr = Lucid.wallet.address
      const policy = createLockingPolicyScript(null, walletAddr)
      const fileSrc = 
        data.ipfsHash 
          ? `ipfs://${data.ipfsHash.replace('ipfs://', '')}`
          : `ar://${data.arweaveHash.replace('ar://', '')}`

      const metadata = {
        [policy.policyId]: {
          [inputs.name]: {
            name: inputs.metadataName,
            image: `ipfs://QmWbpAupVYwj7pVE6i3VMALMwngctS8F5ucCNLwg9RqCn3`,
            publisher: "CardanoSounds.com",
            files: [
              {
                mediaType: mimeType,
                name: inputs.metadataName,
                src: fileSrc
              }
            ]
          },
        },
      }

      if (inputs.author) (metadata[policy.policyId][inputs.name] as any).author = inputs.author;

      let mintAssets: Assets = {}
      mintAssets[policy.policyId + Buffer.from(inputs.name.replace(/[\W_]/g, ''), 'ascii').toString('hex')] = BigInt(inputs.quantity)

      const txHash = await mintTx(policy, metadata, mintAssets, walletStore.name)
      
      if (txHash.toString().length === 64) {
        toast.closeAll();
        SuccessTransactionToast(toast, txHash);
        setLoading(false);
        console.log(txHash);
      } else {
        await TxErrorSubmitToast(toast);
        setLoading(false);
      }
    } catch(e: any){
          console.log(e);
          FailedTransactionToast(toast);
          setLoading(false);
    }
  };

  return (
    <Box
      width="100%"
      height="75vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        width="90%"
        maxWidth="65vw"
        rounded="lg"
        display="flex"
        alignItems="center"
        flexDirection="column"
        padding="10"
      >
        <Text fontWeight="bold" fontSize="36" mb={4}>
          Mint the sound with a Dapp connector wallet
        </Text>
        <Box w="10" />
        <Flex flexDirection="row" w="80%">
          <Flex flexDirection="column" w="75%">
            <Input
              focusBorderColor="blue.700"
              width="60%"
              placeholder="Name"
              value={inputs.metadataName}
              onInput={(e: { target: any; }) => {
                const val = (e.target as any).value;
                const name = val.replace(/[^A-Z0-9]/gi, "");
                const metadataName = val;
                if (name.length > 32 || metadataName.length > 64) return;
                setInputs((i) => ({ ...i, name, metadataName }));
              }}
            />
            <Box h="4" />
            <Input
              type="number"
              focusBorderColor="blue.700"
              width="60%"
              placeholder="Quantity"
              value={inputs.quantity}
              onInput={(e: { target: any; }) => {
                const val = (e.target as any).value;
                setInputs((i) => ({ ...i, quantity: val }));
              }}
            />
            <Box h="4" />
            <Input
              value={inputs.author}
              focusBorderColor="blue.700"
              width="60%"
              placeholder="Author (optional)"
              onInput={(e: { target: any; }) => {
                const val = (e.target as any).value;
                if (val.length > 64) return;
                setInputs((i) => ({ ...i, author: val }));
              }}
            />
          </Flex>
          <Box w="14" />
          <Button
            my="auto"
            onClick={async () =>
              (await checkStatus(toast, connected)) && makeTx()
            }
            width="100px"
            isDisabled={!(inputs.name && inputs.quantity && inputs.metadataName)}
            isLoading={loading}
            variant="ghost"
          >
            Mint
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default MintBtn;
