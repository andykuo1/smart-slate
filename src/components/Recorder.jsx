'use client';

import { useEffect, useRef, useState } from 'react';
import Button from './Button';
import ShotTakeInfo from './ShotTakeInfo';

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
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-[60vmin] h-[60vmin]">
        Video stream not available.
      </video>
      <div className="flex flex-col sticky bottom-0 w-full text-center">
        <Button title="Record" className="flex-1 mx-0" onClick={() => setRecording(prev => !prev)}/>
        <ShotTakeInfo/>
      </div>
    </div>
  );
}
