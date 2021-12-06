import {
    Box,
    Button,
    Input,
    Link,
    Spinner,
    Text,
    useToast,
  } from "@chakra-ui/react";
  import React from "react";
  import NamiJs from "../nami-js";
  import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
  import MiddleEllipsis from "react-middle-ellipsis";
  
  let nami;
  
  const Send = () => {
    const toast = useToast();
    const [connected, setConnected] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [rawImage, setRawImage] = React.useState("");
    const [inputs, setInputs] = React.useState({
      image: "",
      name: "",
      metadataName: "",
      quantity: "1",
      author: "",
    });
  
    const init = async () => {
      nami = new NamiJs(
        "https://cardano-mainnet.blockfrost.io/api/v0",
        "mainnetGHf1olOJblaj5LD8rcRudajSJGKRU6IL"
      );
      // ipfs = await initIpfs();
      setConnected(window.localStorage.getItem('cswallet') === 'connected')
    };

    const checkStatus = async (toast, connected) => {
      setConnected(window.localStorage.getItem('cswallet') === 'connected')
      return (
        NoNami(toast) &&
        (await NotConnectedToast(toast, connected)) &&
        (await WrongNetworkToast(toast))
      );
    };
  
    const makeTx = async () => {
      setLoading(true);
      // const result = await ipfs.add(rawImage);
      // const hash = result.path;
      const hash = 'QmWbpAupVYwj7pVE6i3VMALMwngctS8F5ucCNLwg9RqCn3'
      const policy = await nami.createLockingPolicyScript();
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
            image: `ipfs://${hash}`,
            publisher: "CardanoSounds"
          },
        },
      };
      if (inputs.author) metadata[policy.id][inputs.name].author = inputs.author;
      const tx = await nami
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
      const signedTx = await nami.signTx(tx).catch(() => setLoading(false));
      if (!signedTx) return;
      const txHash = await nami.submitTx(signedTx);
      PendingTransactionToast(toast);
      await nami.awaitConfirmation(txHash);
      toast.closeAll();
      SuccessTransactionToast(toast, txHash);
      setLoading(false);
      console.log(txHash);
    };
  
    React.useEffect(() => {
      init();
    }, []);
    React.useEffect(() => {
      if (connected)
        window.cardano.onAccountChange(async () => {
          const address = await nami.baseAddressToBech32();
          setConnected(address);
        });
    });
    return (
      <Box
        width="100%"
        height="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        // background="gray.100"
      >       
        <Box
          width="90%"
          maxWidth="500px"
          // background="white"
          rounded="lg"
          shadow="lg"
          display="flex"
          alignItems="center"
          flexDirection="column"
          padding="10"
        >
          <Text fontWeight="bold" fontSize="22">
            Mint native assets
          </Text>
          <Text fontWeight="bold" fontSize="22">
            with a Nami wallet
          </Text>
          {/* <Box h="6" />
          <ImageDrop
            onLoadedRaw={(rawImage) => {
              console.log(rawImage);
              setRawImage(rawImage);
            }}
          /> */}
          <Box h="10" />
          <Input
            focusBorderColor="teal.400"
            width="60%"
            placeholder="Name"
            value={inputs.metadataName}
            onInput={(e) => {
              const val = e.target.value;
              const name = val.replace(/[^A-Z0-9]/gi, "");
              const metadataName = val;
              if (name.length > 32 || metadataName.length > 64) return;
              setInputs((i) => ({ ...i, name, metadataName }));
            }}
          />
          <Box h="4" />
          <Input
            type="number"
            focusBorderColor="teal.400"
            width="60%"
            placeholder="Quantity"
            value={inputs.quantity}
            onInput={(e) => {
              const val = e.target.value;
              setInputs((i) => ({ ...i, quantity: val }));
            }}
          />
          <Box h="4" />
          <Input
            value={inputs.author}
            focusBorderColor="teal.400"
            width="60%"
            placeholder="Author (optional)"
            onInput={(e) => {
              const val = e.target.value;
              if (val.length > 64) return;
              setInputs((i) => ({ ...i, author: val }));
            }}
          />
          <Box h="14" />
          <Button
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
        </Box>
      </Box>
    );
  };
  
  const Ellipsis = ({ connected }) => {
    const [change, setChange] = React.useState(false);
  
    React.useEffect(() => {
      setChange(true);
      setTimeout(() => setChange(false));
    }, [connected]);
  
    return (
      !change && (
        <div style={{ width: "200px", whiteSpace: "nowrap", fontWeight: "bold" }}>
          <MiddleEllipsis>
            <span>{connected}</span>
          </MiddleEllipsis>
        </div>
      )
    );
  };
    
  const NoNami = (toast) => {
    if (window.cardano) return true;
    toast({
      position: "bottom-right",
      title: (
        <Box width="full" display="flex">
          <Text>Nami not installed</Text>
          <Button
            onClick={() => window.open("https://namiwallet.io")}
            ml="6"
            mr="-4"
            size="xs"
            // background="white"
            color="orange.400"
            rightIcon={<ChevronRightIcon />}
          >
            Get it
          </Button>
        </Box>
      ),
  
      status: "warning",
      duration: 9000,
    });
    return false;
  };
  
  const WrongNetworkToast = async (toast) => {
    console.log(await window.cardano.getNetworkId());
    if ((await window.cardano.getNetworkId()) === 1) return true;
    toast({
      position: "bottom-right",
      title: "Wrong network",
      status: "info",
      duration: 5000,
    });
    return false;
  };
  
  const NotConnectedToast = async (toast, connected) => {
    if (connected) return true;
    toast({
      position: "bottom-right",
      title: "Connect the wallet first",
      status: "info",
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
  };
  
  export default Send;
  