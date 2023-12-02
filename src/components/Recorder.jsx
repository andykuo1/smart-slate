'use client';

import { useEffect, useRef, useState } from 'react';

import { downloadURLImpl } from '../utils/Downloader';
import Button from './Button';
import { useShotTake } from './ShotContext';
import ShotTakeInfo from './ShotTakeInfo';

export default function Recorder({}) {
  const [recording, setRecording] = useState(false);
  const { state, setState, getState } = useShotTake();

  /** @type {import('react').RefObject<HTMLVideoElement|null>} */
  const videoRef = useRef(null);
  /** @type {import('react').RefObject<MediaRecorder|null>} */
  const recorderRef = useRef(null);
  /** @type {import('react').RefObject<Array<?>>} */
  const chunksRef = useRef([]);

  function onRecorderStart() {
    let video = videoRef.current;
    video.srcObject = recorderRef.current.stream;
    video.play();
    let nextTake = state.take + 1;
    let shotTakeId = 'sst-' + state.scene + '.' + state.shot;
    let result = sessionStorage.getItem(shotTakeId);
    if (result) {
      nextTake = Number(result) + 1;
    }
    sessionStorage.setItem(shotTakeId, String(nextTake));
    setState({ ...state, take: nextTake });
    setRecording(true);
  }

  function onRecorderStop() {
    getState((state) => {
      let name = getFileName(state);
      let chunks = chunksRef.current;
      chunksRef.current = [];
      downloadFile(name, chunks);
    });
  }

  function onRecorderData(e) {
    chunksRef.current.push(e.data);
  }

  useEffect(() => {
    if (recording) {
      alert(navigator.mediaDevices.getSupportedConstraints());
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          let recorder = new MediaRecorder(stream);
          recorderRef.current = recorder;
          recorder.addEventListener('stop', onRecorderStop);
          recorder.addEventListener('dataavailable', onRecorderData);
          recorder.addEventListener('start', onRecorderStart);
          recorder.start();
        })
        .catch(alert);
    } else {
      if (recorderRef.current) {
        recorderRef.current.stop();
        videoRef.current.srcObject = null;
      }
    }
  }, [recording, videoRef, recorderRef]);

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-[60vmin] h-[60vmin]">
        Video stream not available.
      </video>
      <div className="flex flex-col sticky bottom-0 w-full text-center">
        <Button
          title="Record"
          className="flex-1 mx-0"
          onClick={() => setRecording((prev) => !prev)}
        />
        <ShotTakeInfo />
      </div>
    </div>
  );
}

function getFileName(shotTake) {
  return `Untitled_Scene ${shotTake.scene}_Shot ${shotTake.shot}_Take ${shotTake.take}.mp4`;
}

function downloadFile(fileName, chunks) {
  let [chunk] = chunks;
  if (!chunk) return;
  const blob = new Blob(chunks, { type: chunk.type || 'video/mp4' });
  const url = URL.createObjectURL(blob);
  downloadURLImpl(fileName, url);
}
