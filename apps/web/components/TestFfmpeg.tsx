import { Button, Flex } from "@chakra-ui/react";
import getContractAssetsHook from "../hooks/getContractAssetsHook";
import getUserAssetsHook from "../hooks/getUserAssetsHook";
import filetype from 'magic-bytes.js'
import all from 'it-all'
import { concat as uint8ArrayConcat } from 'uint8arrays/concat'
import * as IPFS from 'ipfs-core'
import { useEffect, useState } from "react";
import Arweave from "arweave";
import MintBtn from "./MintBtn";

export default function TestFfmpeg() {
    // const [ userAssetViews, loadUserAssetViews ] = getUserAssetsHook()
    // const [ contractAssetViews, loadContractAssetViews ] = getContractAssetsHook()
    // const [ipfsNode, setIpfsNode] = useState<IPFS | undefined>()
    let ipfsNode = null//await IPFS.create()

    const [uploadData, setUploadData] = useState<Uint8Array>()
    const [minting, setMinting] = useState<boolean>(false)
    const [arweaveHash, setArweaveHash] = useState<string>()
    const [mimeType, setMimeType] = useState<string>()
    const { component, upload, arweave } = useArweaveConnect()
    // const usersAssets 

    // const loadAssets

    useEffect(() => {
        console.log(uploadData)
    }, [uploadData])

    const test = async () => {
        // console.log('contractAssetViews')
        // console.log(contractAssetViews)
        // console.log('userAssetViews')
        // console.log(userAssetViews)
        if (!ipfsNode) ipfsNode = await IPFS.create()
        const response = await ipfsData('QmbytYGomBm136d3xWm1vuku9givkQS2WxmLxFKTXwXixj')
        const response2 = await ipfsData('QmT79cTHosBWS5mUJ2K8TkFPd9PeZZ7b5a5ZNgmnmewDDh')
        console.log(response)
        console.log(response2)
        testFfmpeg(response, response2)
        //QmT79cTHosBWS5mUJ2K8TkFPd9PeZZ7b5a5ZNgmnmewDDh
    }

    const handleUpload = async () => {
        const arTxId = await upload(uploadData)
        setArweaveHash(arTxId)
        setMimeType('video/mp4')
        setMinting(true)
    }

    const arData = async (id: string) => {
        return await arweave.transactions.getData(id.replace('ar://', ''), {decode: true})
    }

    const ipfsData = async (id: string) => {
        if (!ipfsNode) ipfsNode = await IPFS.create()
        return uint8ArrayConcat(await all(ipfsNode.cat(id.replace('ipfs://', ''))))
    }

    const testFfmpeg = async (picFile: Uint8Array, soundFile: Uint8Array) => {
        // test()
        const picFT = filetype(picFile)
        console.log(picFT)
        const soundFT = filetype(soundFile)
        console.log(soundFT)
        // const message = document.getElementById('message');
        const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
        const ffmpeg = createFFmpeg({
            //    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
            log: true,

            progress: ({ ratio }) => {
                // message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
            },
        });
        // ffmpeg -loop 1 -i ima.jpg -i audio.wav -c:v libx264 -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest out.mp4

        // const joinAudioWithVideo = async (audio: Uint8Array, video: Uint8Array) => {
        await ffmpeg.load();
        ffmpeg.FS('writeFile', 'cs-sound-audio.mp3', soundFile)//await fetchFile('/music.mp3'))//audio)
        ffmpeg.FS('writeFile', 'cs-image.png', picFile)//await fetchFile('/noise.png'))
        await ffmpeg.run('-loop', '1', '-i', 'cs-image.png', '-i', 'cs-sound-audio.mp3', '-c:v', 'libx264', '-tune', 'stillimage', '-c:a', 'aac', '-b:a', '192k', '-pix_fmt', 'yuv420p', '-shortest', 'output.mp4');
        // await ffmpeg.run('-i', 'cs-sound-video.mp4', '-i', 'cs-sound-audio.mp3', '-shortest', 'output.mp4');
        const data = ffmpeg.FS('readFile', 'output.mp4');
        const videoHtml: any = document.getElementById('output-video');
        videoHtml.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        setUploadData(data)
        // }
        // document.getElementById('uploader').addEventListener('change', transcode);
    }

    return (
        <>
            {component}
            <video id='output-video' controls></video><br />
            <Button onClick={() => test()}>Click</Button>
            <Button onClick={handleUpload}>Upload</Button>
            {minting ? <MintBtn arweaveHash={arweaveHash} ipfsHash={null} mimeType={mimeType}/> : <></>}
        </>
    )
}

function useArweaveConnect() {
    const arweave = Arweave.init({});
    const wallet = 'use_wallet';

    const [address, setAddress] = useState("Requesting...");

    const activate = async () => {
        await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'SIGN_TRANSACTION'], {
            name: 'Cardano Sounds'
        });
        const addr = await window.arweaveWallet.getActiveAddress();
        setAddress(addr);
    }

    const upload = async (data: Uint8Array) => {
        if (address === "Requesting...") return
        let transaction = await arweave.createTransaction({ data: data }, wallet);
        transaction.addTag('Content-Type', 'video/mp4');

        await arweave.transactions.sign(transaction, wallet)

        let uploader = await arweave.transactions.getUploader(transaction);

        while (!uploader.isComplete) {
            await uploader.uploadChunk();
            console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
        }
        console.log({ uploaded: transaction.id })
        return transaction.id
    }

    const component = (
        <Flex align="center" justify="center" minH="85vh" mt="15vh" m="0">
            <>
                <h1>Wallet</h1>
                {address != "Requesting..." ? (
                    <div>
                        <div>Account: {address}</div>
                        {/* <button onClick={() => wallet.disconnect()}>disconnect</button> */}
                    </div>
                ) : (
                    <div>
                        Connect:
                        <button onClick={activate}>ArConnect</button>
                    </div>
                )}
            </>
        </Flex>
    )

    return { component, upload, arweave }
}
