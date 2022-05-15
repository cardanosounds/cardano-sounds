import {
  Box,
  Button,
  Input,
  Text,
  useToast,
  Flex,
  Select,
  Image,
  Heading,
  Textarea,
  Accordion,
  AccordionIcon,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  useColorMode,
  Popover, PopoverTrigger, PopoverContent, PopoverCloseButton, PopoverHeader, PopoverBody, PopoverArrow, Checkbox
} from "@chakra-ui/react";
import { prepMetadata } from "../lib/mintMetadata"
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import NextChakraLink from "./NextChakraLink";
import { NotConnectedToast, NftLimitToast, SuccessTransactionToast, PendingTransactionToast, TxErrorSubmitToast, NoWalletToast } from '../lib/toasts'
import { createLockingPolicyScript } from "../cardano/utils";
import { useStoreState } from "../store";
import { Assets, Tx, WalletProvider } from "lucid-cardano";

const Mint = () => {
  const toast = useToast()
  const { colorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(false)
  const [filesWithType, setFilesWithType] = useState([])
  const [quantityDict, setQuantityDict] = useState({})
  const [nfts, setNfts] = useState([])
  const [policyLockDate, setPolicyLockDate] = useState(null)
  const [policyLock, setPolicyLock] = useState(null)
  const walletStore = useStoreState(state => state.wallet)

  const [inputs, setInputs] = useState({
    image: "",
    name: "",
    publisher: '',
    collection: '',
    summary: '',
    description: '',
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

  const checkStatus = async (toast, connected) => {
    connected = walletStore.connected
    setConnected(connected)
    return (
      NoWalletToast(toast, window.cardano) &&
      (await NotConnectedToast(toast, connected)) //&&
    )
  }

  const checkNftCount = async (toast, nfts) => {
    return (
      NftLimitToast(toast, nfts)
    )
  }

  const addNft = async () => {
    const metadata = prepMetadata(inputs.image, filesWithType, inputs)
    if (inputs.author) metadata[inputs.name].author = inputs.author;
    const quantityDictCopy = JSON.parse(JSON.stringify(quantityDict))
    quantityDictCopy[inputs.name] = inputs.quantity
    setQuantityDict(quantityDictCopy)
    setNfts([...nfts].concat(metadata))
  }

  const trimEllip = (string: string, length: number) => {
    return string.length > length ? string.substring(0, length) + ".." : string;
  }

  const uniqBy = (a, key): any => {
    return [
      ...new Map(
        a.map((x: any) => [key(x), x])
      ).values() 
    ]
  }

  const makeTx = async () => {
    setLoading(true)
    const { Lucid, Blockfrost } = await import('lucid-cardano')

    await Lucid.initialize(
      'Testnet',
      new Blockfrost('https://cardano-testnet.blockfrost.io/api/v0', 'testnetRvOtxC8BHnZXiBvdeM9b3mLbi8KQPwzA')
    )
    await Lucid.selectWallet(walletStore.name as WalletProvider)
    const walletAddr = Lucid.wallet.address
    const mintPolicy = createLockingPolicyScript(null, walletAddr)
    console.log(mintPolicy)
    const policyScript: {
      type: string;
      scripts: any[];
  } = {
      type: "all",
      scripts: [
        {
          keyHash: mintPolicy.paymentKeyHash,
          type: "sig",
        }
      ],
    }
    if (policyLockDate) policyScript.scripts.push({ slot: mintPolicy.lockSlot, type: "before" })
    console.log(JSON.stringify(policyScript))
    fetch(`https://pool.pm/register/policy/${mintPolicy.policyId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(policyScript),
    })

    let metadata = {
      [mintPolicy.policyId]: prepMetadata(inputs.image, filesWithType, inputs)
    }

    nfts.forEach((nft) => {
      console.log("nft")
      console.log(nft)
      metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name] = {
        name: nft[Object.keys(nft)[0]].name,
        image: nft[Object.keys(nft)[0]].image,
        publisher: nft[Object.keys(nft)[0]].publisher,
      }

      if (nft[Object.keys(nft)[0]].files) {
        metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name]["files"] = nft[Object.keys(nft)[0]].files
      }
      if (nft[Object.keys(nft)[0]].description) {
        metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name]["description"] = nft[Object.keys(nft)[0]].description
      }
      if (nft[Object.keys(nft)[0]].summary) {
        metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name]["summary"] = nft[Object.keys(nft)[0]].summary
      }
      if (nft[Object.keys(nft)[0]].arweaveHash) {
        metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name]["arweaveHash"] = nft[Object.keys(nft)[0]].arweaveHash
      }
      if (nft[Object.keys(nft)[0]].author) {
        metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name]["author"] = nft[Object.keys(nft)[0]].author
      }
      metadata[mintPolicy.policyId][nft[Object.keys(nft)[0]].name]["name"] = nft[Object.keys(nft)[0]].name
    })

    if (inputs.author) metadata[mintPolicy.policyId][inputs.name].author = inputs.author;

    let allNfts = nfts.map((nft) => ({ name: nft[Object.keys(nft)[0]].name, quantity: quantityDict[nft[Object.keys(nft)[0]].name] })).concat({ name: inputs.name, quantity: inputs.quantity })
    allNfts = uniqBy(allNfts, it => it.name)
    console.log(JSON.stringify(allNfts))
    let mintAssets: Assets = {}
    allNfts.forEach(nft => mintAssets[mintPolicy.policyId + Buffer.from(nft.name.replace(/[\W_]/g, ''), 'ascii').toString('hex')] = BigInt(nft.quantity))
    const tx = await Tx.new()
            .attachMetadataWithConversion(721, metadata)
            .attachMintingPolicy({
                type: "Native",
                script: Buffer.from(mintPolicy.script.to_bytes()).toString('hex')
            })
            .mintAssets(mintAssets)
            .addSigner(walletAddr)
            .complete();

    try {
      const signedTx = (await tx.sign()).complete();
      const txHash = await signedTx.submit();
      if (txHash.toString().length === 64) {
        PendingTransactionToast(toast);
        toast.closeAll();
        SuccessTransactionToast(toast, txHash);
        setLoading(false);
        console.log(txHash);
        return
      }
    }
    catch (err) {
      console.log(`error: ${JSON.stringify(err)}`)
    }
    await TxErrorSubmitToast(toast);
    setLoading(false);
  };

  return (
    <Box
      width="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      pt="15vh"

    >
      <Text
        display={["flex", "flex", "flex", "none"]}
      >
        Unfortunately, tool does not support smaller devices yet.
      </Text>
      <Box
        width="90%"
        minWidth="70rem"
        maxWidth="65vw"
        rounded="lg"
        alignItems="center"
        flexDirection="column"
        padding="10"
        m="auto"
        display={["none", "none", "none", "flex"]}
      >
        <Flex direction="column">
          <NextChakraLink target="blank" href="/mint-info" p="0.5rem">
            <Heading float="right" _hover={{ transform: "scale(1.05)" }} fontSize="24">MORE INFO</Heading>
          </NextChakraLink>
          <Heading fontWeight="bold" fontSize="36" mb={4}>🎶 Mint Cardano NFTs with a Dapp connector wallet </Heading>
        </Flex>
        <Box w="10" />
        {nfts.length > 0 ?
          <Flex h={36} direction={"row"} overflow="auto" whiteSpace={"nowrap"} maxW="50vw" py={2}>
            {nfts?.map((nft, i) => (
              <Popover key={i}>
                {({ onClose }) => (
                  <>
                    <PopoverTrigger>
                      <Flex h={34} w={24} mx={2} direction="column" textAlign={"center"}>
                        <Flex h={24} w={24}>
                          <Image h={24} w={24} src={`https://infura-ipfs.io/ipfs/${nft[Object.keys(nft)[0]].image.replace("ipfs://", "")}`} fallbackSrc="/noise.png" />
                        </Flex>
                        <Heading fontSize={14} maxW={24} >{trimEllip(nft[Object.keys(nft)[0]].name, 11)}</Heading>
                      </Flex>
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverHeader>Cancel?</PopoverHeader>
                      <PopoverBody>
                        <Button onClick={() => {
                          const cancelNft = [...nfts].filter((it, index) => index !== i)
                          setNfts(cancelNft)
                          onClose()
                        }}>Cancel</Button>

                      </PopoverBody>
                    </PopoverContent>
                  </>
                )}
              </Popover>

            ))}
          </Flex> : <></>
        }
        <Flex flexDirection="row" w="80%">
          <Flex flexDirection="column" w="75%">
            <Box h="3rem" />
            <Flex flexDirection="row">
              <Text mr={2}>Policy lock</Text>
              <Checkbox
                onChange={(e) => {
                  if (!e.target.checked) {
                    setPolicyLockDate(undefined)
                    setPolicyLock(false)
                    console.log('uncheck')
                  } else {
                    setPolicyLockDate(null)
                    setPolicyLock(true)
                  }
                }}
              />
            </Flex>
            {policyLock ?
              <DatePicker
                id='policy-timelock'
                showTimeInput
                timeInputLabel="Time:"
                dateFormat="MM/dd/yyyy h:mm aa"
                bg="#ffffff00"
                selected={policyLockDate} onChange={(date) => {
                  setPolicyLockDate(date)
                }} /> : <></>}
            <Box h="3rem" />
            <Input
              focusBorderColor="blue.700"
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
              placeholder="Quantity"
              value={inputs.quantity}
              onInput={(e) => {
                const val = e.target.value;
                setInputs((i) => ({ ...i, quantity: val }));
              }}
            />
            <Box h="4" />
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
            {OptionalInputs(isDark, inputs, setInputs)}
            <Box h="4" />
            {FileInput(isDark, fileInputs, setFileInputs, setFilesWithType, filesWithType)}
          </Flex>
          <Box w="14" />
          <Flex display="column">
            <Button
              my="auto"
              h="12rem"
              onClick={async () =>
                (await checkNftCount(toast, nfts)) && await addNft()
              }
              width="100px"
              isDisabled={!(inputs.name && inputs.quantity && inputs.metadataName && inputs.image)}
              isLoading={loading}
              variant="ghost"
            >
              Add
            </Button>
            <Box w="14" />
            <Button
              my="auto"
              h="12rem"
              onClick={async () =>
                (await checkStatus(toast, connected)) && makeTx()
              }
              width="100px"
              isDisabled={!(inputs.name && inputs.quantity && inputs.metadataName && inputs.image)}
              isLoading={loading}
              variant="ghost"
            >
              Mint
            </Button>
          </Flex>

        </Flex>
      </Box>
    </Box>
  );
};

const OptionalInputs = (isDark, inputs, setInputs) => {
  return <Accordion allowToggle>
    <AccordionItem>
      <h2>
        <AccordionButton _expanded={{ bg: isDark ? 'gray.700' : 'gray.200' }}>
          <Box flex='1' textAlign='left'>
            Optional fields
          </Box>
          <AccordionIcon />
        </AccordionButton>
      </h2>
      <AccordionPanel>
        <Box h="4" />
        <Input
          focusBorderColor="blue.700"
          placeholder="Image Arweave hash (optional)"
          value={inputs.arweaveHash}
          onInput={(e) => {
            const val = e.target.value;
            setInputs((i) => ({ ...i, arweaveHash: val }));
          }} />
        <Box h="4" />
        <Input
          value={inputs.author}
          focusBorderColor="blue.700"
          placeholder="Author (optional)"
          onInput={(e) => {
            const val = e.target.value;
            if (val.length > 64)
              return;
            setInputs((i) => ({ ...i, author: val }));
          }} />
        <Box h="4" />
        <Input
          focusBorderColor="blue.700"
          placeholder="Publisher (optional)"
          value={inputs.publisher}
          onInput={(e) => {
            const val = e.target.value;
            setInputs((i) => ({ ...i, publisher: val }));
          }} />
        <Box h="4" />
        <Input
          focusBorderColor="blue.700"
          placeholder="Summary (optional)"
          value={inputs.summary}
          onInput={(e) => {
            const val = e.target.value;
            setInputs((i) => ({ ...i, summary: val }));
          }} />
        <Box h="4" />
        <Textarea
          focusBorderColor="blue.700"
          placeholder="Description (optional)"
          value={inputs.description}
          onInput={(e) => {
            const val = e.target.value;
            setInputs((i) => ({ ...i, description: val }));
          }} />

      </AccordionPanel>
    </AccordionItem>
  </Accordion>;
}

const FileInput = (isDark, fileInputs, setFileInputs, setFilesWithType, filesWithType) => {
  return (
    <Accordion allowToggle>
      <AccordionItem>
        <h2>
          <AccordionButton _expanded={{ bg: isDark ? 'gray.700' : 'gray.200' }}>
            <Box flex='1' textAlign='left'>
              Files
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Box h="4" />
          <Input
            value={fileInputs.name}
            focusBorderColor="blue.700"
            placeholder="Name"
            onInput={(e) => {
              const val = e.target.value;
              setFileInputs((i) => ({ ...i, name: val }));
            }} />
          <Box h="4" />
          <Input
            value={fileInputs.ipfsHash}
            focusBorderColor="blue.700"
            placeholder="IPFS Hash"
            onInput={(e) => {
              const val = e.target.value;
              setFileInputs((i) => ({ ...i, ipfsHash: val }));
            }} />
          <Box h="4" />
          <Input
            focusBorderColor="blue.700"
            // width="60%"
            placeholder="Arweave hash (Optional - you don't need ipfs hash if filled)"
            value={fileInputs.arweaveHash}
            onInput={(e) => {
              const val = e.target.value;
              setFileInputs((i) => ({ ...i, arweaveHash: val }));
            }} />
          <Box h="4" />
          <Select
            value={fileInputs.mediaType}
            onChange={(val) => {
              const { target } = val;
              if (target.type === 'select-one') {
                const selectValue = target.selectedOptions[0].value;
                setFileInputs((i) => ({ ...i, mediaType: selectValue }));
              }
            }}
            placeholder='Select media type:'
          >
            <option value='video/mp4'>mp4</option>
            <option value='audio/mpeg'>mp3</option>
            <option value='audio/ogg'>ogg</option>
            <option value='image/png'>png</option>
            <option value='image/gif'>gif</option>
            <option value='image/svg+xml'>svg</option>
            <option value='image/jpeg'>jpg</option>
            <option value='text/html'>html</option>
          </Select>
          <Box h="4" />
          <Button onClick={() => {
            if ((fileInputs.ipfsHash !== "" || fileInputs.arweaveHash !== "") && fileInputs.name !== "" && fileInputs.mediaType) {
              setFilesWithType(
                filesWithType.concat(
                  {
                    ipfsHash: fileInputs.ipfsHash,
                    mediaType: fileInputs.mediaType,
                    name: fileInputs.name,
                    arweaveHash: fileInputs.arweaveHash
                  }
                )
              );
              setFileInputs({
                name: "",
                ipfsHash: "",
                mediaType: "",
                arweaveHash: ""
              });
            }
          }}>
            Add file +
          </Button>
          {filesWithType.map((fileWithType, index) => (
            <Flex key={index}>
              <Text p={2}>{fileWithType.name}</Text>
              <Text p={2}>{fileWithType.ipfsHash}</Text>
              <Text p={2}>{fileWithType.mediaType}</Text>
              <Text p={2}>{fileWithType.arweaveHash}</Text>
              <Button variant={"ghost"} _hover={{ transform: "scale(1.05)" }} onClick={() => {
                const cancelFile = [...filesWithType].filter((fil, i) => i !== index)
                setFilesWithType(cancelFile)
              }}>x</Button>
            </Flex>
          ))}
        </AccordionPanel>
      </AccordionItem>
    </Accordion>)
}

export default Mint;