import dynamic from "next/dynamic";
import { Flex } from '@chakra-ui/react';
import Layout from '../components/layout';
import { useState } from "react";

const TestButton = dynamic(() => import("../components/TestFfmpeg"),
    { ssr: false }
);
export default function Test() {

    // const [videoSrc, setVideoSrc] = useState('');
    // const [message, setMessage] = useState('Click Start to transcode');
    // const ffmpeg = createFFmpeg({
    //     log: true,
    // });
    // const doTranscode = async () => {
    //     setMessage('Loading ffmpeg-core.js');
    //     await ffmpeg.load();
    //     setMessage('Start transcoding');
    //     ffmpeg.FS('writeFile', 'test.mp4', await fetchFile('/test.mp4'));
    //     await ffmpeg.run('-i', 'test.mp4', 'test.avi');
    //     setMessage('Complete transcoding');
    //     const data = ffmpeg.FS('readFile', 'test.avi');
    //     setVideoSrc(URL.createObjectURL(new Blob([data.buffer], { type: 'video/x-msvideo' })));
    // };

export default function Mint() {
    
    return (
        <Layout>
            <Flex align="center" justify="center" minH="85vh" w="100vw">
                <TestButton/>
                {/* <p />
                <video src={videoSrc} controls></video><br />
                <button onClick={doTranscode}>Start</button>
                <p>{message}</p> */}
            </Flex>
        </Layout>
    )
}