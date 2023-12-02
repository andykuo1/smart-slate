'use client';

import { useEffect, useRef, useState } from 'react';

import { downloadURL, downloadURLImpl } from '../utils/Downloader';
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
    if (!isMediaRecorderSupported()) {
      alert('MediaRecorder is not supported!');
    }
    if (recording) {
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
        .catch((e) => alert(JSON.stringify(e?.message || e)));
    } else {
      if (recorderRef.current) {
        recorderRef.current.stop();
        videoRef.current.srcObject = null;
      }
    }
  }, [recording, videoRef, recorderRef]);

  function onChange(e) {
    let file = e.target.files[0];
    e.target.files.length = 0;
    let url = URL.createObjectURL(file);
    let fileName = getFileName(state);
    downloadURLImpl(fileName, url);
  }

  return (
    <div className="flex flex-col items-center">
      <video ref={videoRef} className="w-[60vmin] h-[60vmin]">
        Video stream not available.
      </video>
      <input type="file" accept="video/*" capture="environment" onChange={onChange}/>
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

function isMediaRecorderSupported() {
  if (!window.MediaRecorder) {
    return false;
  }
  if (window.MediaRecorder.isTypeSupported) {
    return window.MediaRecorder.isTypeSupported('audio/mp4')
      && window.MediaRecorder.isTypeSupported('video/mp4');
  }
  return false;
}
