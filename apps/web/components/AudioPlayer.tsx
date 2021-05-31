import React, { useState, useEffect } from "react";

const useAudio = (url: string) => {
  const [audio, setAudio] = useState<HTMLAudioElement>()

 {/* const [audio] = useState<HTMLAudioElement>(new Audio(url)); */}
  const [playing, setPlaying] = useState<boolean>(false);

  const toggle = () => setPlaying(!playing);

  useEffect(() => {

      if (audio !== null) {
          playing ? audio.play() : audio.pause();
      }
    },
    [playing]
  );

  useEffect(() => {
      
    setAudio(new Audio(url))
    console.log(url)
    console.log(audio)
    const audio2 = new Audio(url)
    audio.addEventListener('ended', () => setPlaying(false));
    return () => {
      audio.removeEventListener('ended', () => setPlaying(false));
    };
  }, []);

  return [playing, toggle];
};

export default function AudioPlayer({ url } : {url: string}) {
  const [playing, setPlaying] = useState<boolean>()

  var audio = typeof(document) === "undefined" ? null : document.getElementById('a') as HTMLAudioElement;
  
  function play() {
    if(audio === null) {
      audio = document.getElementById('a') as HTMLAudioElement;
    }
    audio.play();
  }

  function pause() {
    if(audio === null) {
      audio = document.getElementById('a') as HTMLAudioElement;
    }
    audio.pause();
  }

  useEffect(() => {
    if(audio !== null) {
      audio.addEventListener('ended', () => setPlaying(false));
      return () => {
        audio.removeEventListener('ended', () => setPlaying(false));
      };
    }
  }, []);


  return (
    <div>
        <audio id="a" src={url} />
        <button onClick={play}>Play</button>
    </div>
  );
};
