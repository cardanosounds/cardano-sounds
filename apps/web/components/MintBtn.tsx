import {
  Box,
  Button,
  Input,
  Text,
  useToast,
  Flex
} from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import WalletJs from "../wallet-js";
import WalletContext from "../lib/WalletContext";
import { FailedTransactionToast, NotConnectedToast, NoWalletToast, PendingTransactionToast, SuccessTransactionToast, TxErrorSubmitToast } from "../lib/toasts";



let wallet
const MintBtn = (ipfsHash) => {
  const toast = useToast()
  const walletCtx = useContext(WalletContext)
  // const initIpfs = useIpfs()
  console.log("ipfsHash")
  console.log(ipfsHash)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [inputs, setInputs] = useState({
    image: "",
    name: "",
    metadataName: "",
    quantity: "1",
    author: ""
  })

  const init = async () => {
    wallet = new WalletJs(
      "https://cardano-mainnet.blockfrost.io/api/v0",
      "mainnetGHf1olOJblaj5LD8rcRudajSJGKRU6IL",
      walletCtx.walletApi
    )
    // ipfs = await initIpfs();
    setConnected(window.localStorage.getItem('cswallet') === 'connected')
  }

  const checkStatus = async (toast, connected) => {
    connected = walletCtx.walletApi !== null
    wallet.walletApi = walletCtx.walletApi
    setConnected(connected)
    return (
      NoWalletToast(toast, wallet.walletApi) &&
      (await NotConnectedToast(toast, connected))
    )
  }

  const makeTx = async () => {
    setLoading(true)
    const policy = await wallet.createLockingPolicyScript()
    fetch(`https://pool.pm/register/policy/${policy.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "all",
        scripts: [
          {
            keyHash: policy.paymentKeyHash,
            type: "sig",
          },
          { slot: policy.ttl, type: "before" },
        ],
      }),
    })
      .then((res) => res.json())
      .then(console.log);
    const metadata = {
      [policy.id]: {
        [inputs.name]: {
          name: inputs.metadataName,
          image: `ipfs://QmWbpAupVYwj7pVE6i3VMALMwngctS8F5ucCNLwg9RqCn3`,
          publisher: "CardanoSounds.com",
          files: [
            {
              mediaType: "audio/WAV",
              name: inputs.metadataName,
              src: `ipfs://${ipfsHash.ipfsHash}`
            }
          ]
        },
      },
    };
    if (inputs.author) (metadata[policy.id][inputs.name] as any).author = inputs.author;
    const tx = await wallet
      .mintTx(
        [{ name: inputs.name, quantity: inputs.quantity }],
        metadata,
        policy
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
    if (txHash.toString().length === 64) {
      PendingTransactionToast(toast);
      await wallet.awaitConfirmation(txHash);
      toast.closeAll();
      SuccessTransactionToast(toast, txHash);
      setLoading(false);
      console.log(txHash);

    } else {
      console.log("error")
      await TxErrorSubmitToast(toast);
      setLoading(false);
    }
  };

  useEffect(() => {
    init();
  }, [])
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
              onInput={(e) => {
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
              onInput={(e) => {
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
              onInput={(e) => {
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
