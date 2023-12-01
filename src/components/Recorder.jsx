'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Button';

export default function Recorder({}) {
  const [recording, setRecording] = useState(false);
  /** @type {import('react').RefObject<HTMLVideoElement|null>} */
  const videoRef = useRef(null);
  useEffect(() => {
    if (recording) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
          setRecording(true);
        })
        .catch(console.error);
    } else {
      let video = videoRef.current;
      video.pause();
      video.srcObject = null;
    }
  }, [recording, videoRef, setRecording]);
  return (
    <div>
      <h2>Recorder</h2>
      <div className="flex flex-col items-center">
        <video ref={videoRef} className="w-[80vmin] h-[80vmin]">
          Video stream not available.
        </video>
        <Button title="Record" onClick={() => setRecording(prev => !prev)}/>
      </div>
    </div>
  );
}
