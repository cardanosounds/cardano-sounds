import { Button } from "@chakra-ui/react";

export default function TestFfmpeg() {
 
    const test = async () => {
        // const message = document.getElementById('message');
        const { createFFmpeg, fetchFile } = await import('@ffmpeg/ffmpeg');
        const ffmpeg = createFFmpeg({
        //    corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
            log: true,

            progress: ({ ratio }) => {
                // message.innerHTML = `Complete: ${(ratio * 100.0).toFixed(2)}%`;
            },
        });

        // const joinAudioWithVideo = async (audio: Uint8Array, video: Uint8Array) => {
            await ffmpeg.load();
            ffmpeg.FS('writeFile', 'cs-sound-audio.mp3', await fetchFile('/music.mp3'))//audio)
            ffmpeg.FS('writeFile', 'cs-sound-video.mp4', await fetchFile('/test.mp4'))
            await ffmpeg.run('-i', 'cs-sound-video.mp4', '-i', 'cs-sound-audio.mp3', '-shortest', 'output.mp4');
            const data = ffmpeg.FS('readFile', 'output.mp4');
            const videoHtml: any = document.getElementById('output-video');
            videoHtml.src = URL.createObjectURL(new Blob([data.buffer], { type: 'video/mp4' }));
        // }
        // document.getElementById('uploader').addEventListener('change', transcode);
    }

    return (
        <>
            <video id='output-video' controls></video><br/>
            <Button onClick={() => test()}>Click</Button>
        </>
    )
}