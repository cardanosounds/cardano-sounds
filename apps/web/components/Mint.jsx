import {
  Box,
  Button,
  Input,
  Spinner,
  Text,
  useToast,
  Flex,
  Select,
  Spacer,
  Heading
} from "@chakra-ui/react";
import { useContext, useState, useEffect } from "react";
import WalletJs from "../wallet-js";
import { ChevronRightIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import WalletContext from "../lib/WalletContext";
import { BsInfoCircleFill } from 'react-icons/bs'
import NextChakraLink from "./NextChakraLink";


let wallet
const Mint = () => {
  const toast = useToast()
  const walletCtx = useContext(WalletContext)
  // const initIpfs = useIpfs()
  const [connected, setConnected] = useState("")
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState(false)
  const [filesWithType, setFilesWithType] = useState([])
  const [inputs, setInputs] = useState({
    image: "",
    name: "",
    metadataName: "",
    quantity: "1",
    author: "",
    arweaveHash: ""
  })
  const [fileInputs, setFileInputs] = useState({
    name: "",
    ipfsHash: "",
    mediaType: "",
    arweaveHash: ""
  })

  const init = async () => {
    // const walletApi = (await window.cardano.ccvault.enable())
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
      NoWallet(toast) &&
      (await NotConnectedToast(toast, connected)) //&&
      // (await WrongNetworkToast(toast, walletCtx.walletApi))
    )
  }

  const makeTx = async () => {
    setLoading(true)
    // const result = await ipfs.add(blob);ipfsHash
    // const hash = result.path;
    // (async () => {
    //   const response = await fetch(
    //     'https://ipfs2arweave.com/permapin/'+hash,
    //     {method: 'POST'}
    //   );
    
    //   console.log(await response.json());
    // })();
    // const hash = 'QmWbpAupVYwj7pVE6i3VMALMwngctS8F5ucCNLwg9RqCn3'
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
    const prepMetadata = (imageipfs, filesWithType) => {
      console.log(`prepMetadata(${imageipfs}, ${filesWithType})`)
      console.log(filesWithType)
      if(inputs.arweaveHash !== '') return {
        [policy.id]: {
          [inputs.name]: {
            name: inputs.metadataName,
            image: `ipfs://${imageipfs.replace('ipfs://', '')}`,
            arweaveId: inputs.arweaveHash, 
            publisher: "CardanoSounds.com",
            files : 
              filesWithType.map((file) => (file.arweaveHash === '' ? (
                { 
                  mediaType: file.mediaType,
                  name: file.name,
                  src: `ipfs://${imageipfs.replace('ipfs://', '')}`
                }) 
                : 
                {
                  mediaType: file.mediaType,
                  name: file.name,
                  arweaveId: file.arweaveHash,
                  src: `ipfs://${imageipfs.replace('ipfs://', '')}`
                }
              ))
          },
        },
      };
      return {
      [policy.id]: {
        [inputs.name]: {
          name: inputs.metadataName,
          image: `ipfs://${imageipfs.replace('ipfs://', '')}`,
          publisher: "CardanoSounds.com",
          files : 
            filesWithType.map((file) => (file.arweaveHash === '' ? (
              { 
                mediaType: file.mediaType,
                name: file.name,
                src: `ipfs://${imageipfs.replace('ipfs://', '')}`
              }) 
              : 
              {
                mediaType: file.mediaType,
                name: file.name,
                arweaveId: file.arweaveHash,
                src: `ipfs://${imageipfs.replace('ipfs://', '')}`
              }
            ))
        },
      },
    };
  }

    const metadata = prepMetadata(inputs.image, filesWithType)
    if (inputs.author) metadata[policy.id][inputs.name].author = inputs.author;
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
    if(txHash.toString().length === 64){
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

  const chooseMediaTypeOpt = (val, index) => {
    console.log(`chooseMediaTypeOpt(${val}, ${index})`)
    let copyArr = filesWithType.slice()
    console.log("index")
    console.log(index)

      console.log("if(copyArr[index].mediaType)")
      copyArr[index].mediaType = val
      setFilesWithType(copyArr)
    console.log("copyArr")
    console.log(copyArr)

  }

  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    // if (connected)
    //   window.cardano.onAccountChange(async () => {
    //     const address = await wallet.baseAddressToBech32();
    //     setConnected(address);
    //   });
  });
  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
    > 
      <Text
        display={["flex", "flex", "flex", "none"]}
      >
        Unfortunately, tool does not support smaller devices yet.
      </Text>      
      <Box
        width="90%"
        maxWidth="65vw"
        rounded="lg"
        // display="flex"
        alignItems="center"
        flexDirection="column"
        padding="10"
        mt="10vh"
        display={["none", "none", "none", "flex"]}
      >
       
          <Flex direction="row" w="50vw"> 
            <Text fontWeight="bold" fontSize="36" mb={4}>Mint NFTs with a Dapp connector wallet </Text>
            <NextChakraLink href="/mint-info" p="0.5rem">
              <BsInfoCircleFill size={36}/>
            </NextChakraLink>
          </Flex>
        
        <Box w="10" />
        <Flex flexDirection="row" w="80%">
          <Flex flexDirection="column" w="75%">
            <Input
              focusBorderColor="blue.700"
              // width="60%"
              placeholder="Image (preview) IPFS hash"
              value={inputs.image}
              onInput={(e) => {
                const val = e.target.value;
                setInputs((i) => ({ ...i, image: val }));
              }}
            />
            <Box h="4" />
            <Input
              focusBorderColor="blue.700"
              // width="60%"
              placeholder="(Optional) Image Arweave hash"
              value={inputs.arweaveHash}
              onInput={(e) => {
                const val = e.target.value;
                setInputs((i) => ({ ...i, arweaveHash: val }));
              }}
            />
            <Box h="4" />
            <Input
              focusBorderColor="blue.700"
              // width="60%"
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
              focusBorderColor="blue.700"
              // width="60%"
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
              focusBorderColor="blue.700"
              // width="60%"
              placeholder="Author (optional)"
              onInput={(e) => {
                const val = e.target.value;
                if (val.length > 64) return;
                setInputs((i) => ({ ...i, author: val }));
              }}
            />
          {/* </Flex>
          <Box w="14" />
          <Flex flexDirection="column" w="75%">             */}
            <Box h="4" />
            <Button onClick={() => {if(!files) setFiles(true) 
            else{
              setFileInputs({
                name: "",
                ipfsHash: "",
                mediaType: "",
                arweaveHash: ""
              })
              setFilesWithType([])
              setFiles(false)}
            }}>{!files ? "Add files" : "Remove files"}</Button>
            {!files ? <></> : <>
            <Box h="4" />
            <Input
              value={fileInputs.name}
              focusBorderColor="blue.700"
              placeholder="Name"
              onInput={(e) => {
                const val = e.target.value;
                setFileInputs((i) => ({ ...i, name: val }));
              }}
            />
            <Box h="4" />
            <Input
              value={fileInputs.ipfsHash}
              focusBorderColor="blue.700"
              placeholder="IPFS Hash"
              onInput={(e) => {
                const val = e.target.value;
                setFileInputs((i) => ({ ...i, ipfsHash: val }));
              }}
            />
            <Box h="4" />
            <Input
              focusBorderColor="blue.700"
              // width="60%"
              placeholder="(Optional) Arweave hash"
              value={fileInputs.arweaveHash}
              onInput={(e) => {
                const val = e.target.value;
                setFileInputs((i) => ({ ...i, arweaveHash: val }));
              }}
            />
            <Box h="4" />
            <Select
              value={fileInputs.mediaType}
              onChange={(val) => {
                  const { target } = val;
                  if (target.type === 'select-one') {
                    const selectValue = target.selectedOptions[0].value;
                    setFileInputs((i) => ({ ...i, mediaType: selectValue }));
                  // chooseMediaTypeOpt(selectValue, index);
                  }
              }}
              placeholder='Select media type:'
            >
              <option value='video/mp4'>mp4</option>
              <option value='audio/mpeg'>mp3</option>
              <option value='audio/ogg'>ogg</option>
              <option value='image/png'>png</option>
              <option value='image/svg+xml'>svg</option>
              <option value='image/jpeg'>jpg</option>
            </Select> 
            <Box h="4" />
            <Button onClick={() => { 
              if(fileInputs.ipfsHash !== "" && fileInputs.name !== "" && fileInputs.mediaType) {
                setFilesWithType(
                  filesWithType.concat(
                    {
                      ipfsHash: fileInputs.ipfsHash, 
                      mediaType: fileInputs.mediaType, 
                      name: fileInputs.name,
                      arweaveHash: fileInputs.arweaveHash
                    }
                  )
                )
                setFileInputs({
                  name: "",
                  ipfsHash: "",
                  mediaType: "",
                  arweaveHash: ""
                })
              }
            }}>
              Add file +
            </Button>
            { filesWithType.map((fileWithType, index) => (
                <Flex key={index}> 
                  <Text p={2}>{fileWithType.name}</Text>
                  <Text p={2}>{fileWithType.ipfsHash}</Text>
                  <Text p={2}>{fileWithType.mediaType}</Text>
                  <Text p={2}>{fileWithType.arweaveHash}</Text>
                </Flex>
            ))}
            </>}
          </Flex>
          <Box w="14" />
          <Button
            my="auto"
            h="33vh"
            onClick={async () =>
              (await checkStatus(toast, connected)) && makeTx()
            }
            // onClick={async () => await decryptWithPassword()}
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

const WrongNetworkToast = async (toast, walletApi) => {
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

export default Mint;
