'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { downloadURLImpl } from '../utils/Downloader';
import Button from './Button';
import { getShotTakeId, useShotTake } from './ShotContext';
import ShotTakeInfo from './ShotTakeInfo';

export default function Recorder({}) {
  const { setStateImpl } = useShotTake();
  const downloadOnceRef = useRef('');

  const onChange = useCallback(
    /**
     * @param {{ data: string }} e
     */
    function onChange({ data }) {
      if (!data) {
        return;
      }
      setStateImpl((prev) => {
        if (downloadOnceRef.current === data) {
          return;
        }
        downloadOnceRef.current = data;

        const fileName = getFileName(prev);
        downloadURLImpl(fileName, data);
        alert('Downloaded - ' + fileName);

        const take = (Number(prev.take) || 0) + 1;
        const shotTakeId = getShotTakeId(prev.scene, prev.shot);
        sessionStorage.setItem(shotTakeId, String(take));
        return {
          ...prev,
          take,
        };
      });
    },
    [setStateImpl, downloadOnceRef],
  );

  const mediaRecorder = useMediaRecorder();
  return (
    <div className="flex flex-col items-center">
      {typeof window !== 'undefined' &&
      window.MediaRecorder &&
      mediaRecorder instanceof MediaRecorder ? (
        <BrowserMediaRecorder
          mediaRecorder={mediaRecorder}
          onChange={onChange}
        />
      ) : mediaRecorder instanceof Error ? (
        <InputMediaRecorder onChange={onChange} />
      ) : (
        <Button
          title="Record"
          className="disabled:opacity-30"
          disabled={true}
        />
      )}
      <div className="flex flex-col sticky bottom-0 w-full text-center">
        <ShotTakeInfo />
      </div>
    </div>
  );
}

function getFileName(shotTake) {
  return `Untitled_Scene ${shotTake.scene}_Shot ${shotTake.shot}_Take ${
    Number(shotTake.take) + 1
  }.mp4`;
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {(e: { data: string }) => void} props.onChange
 */
export function InputMediaRecorder({ className, onChange }) {
  /** @type {import('react').RefObject<HTMLInputElement>} */
  const inputRef = useRef(null);

  const onInputChange = useCallback(
    function onInputChange(e) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      e.target.value = null;
      onChange({ data: url });
    },
    [onChange],
  );

  const onClick = useCallback(
    function onClick(e) {
      if (!inputRef.current) {
        return;
      }
      inputRef.current.click();
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    [inputRef],
  );

  return (
    <>
      <input
        ref={inputRef}
        className="hidden"
        type="file"
        accept="video/*"
        capture="environment"
        onChange={onInputChange}
      />
      <Button title="Record" className={className} onClick={onClick} />
    </>
  );
}

/** @returns {MediaRecorder|null} */
export function useMediaRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState(
    /** @type {MediaRecorder|null} */ (null),
  );
  const onceRef = useRef(false);

  useEffect(() => {
    if (onceRef.current) {
      return;
    }
    onceRef.current = true;
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => setMediaRecorder(new MediaRecorder(stream)))
      .catch((e) => setMediaRecorder(e));
  }, []);

  return mediaRecorder;
}

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {MediaRecorder} props.mediaRecorder
 * @param {(e: { data: string }) => void} props.onChange
 */
export function BrowserMediaRecorder({ className, mediaRecorder, onChange }) {
  const [open, setOpen] = useState(false);
  const [recording, setRecording] = useState(false);

  /** @type {import('react').RefObject<HTMLVideoElement>} */
  const videoRef = useRef(null);
  /** @type {import('react').RefObject<Array<Blob>>} */
  const chunksRef = useRef([]);

  const onRecorderStart = useCallback(
    function onRecorderStart() {
      const video = videoRef.current;
      if (!video) {
        return;
      }
      video.srcObject = mediaRecorder.stream;
      video.play();
    },
    [mediaRecorder, videoRef],
  );

  const onRecorderStop = useCallback(
    function onRecorderStop() {
      const video = videoRef.current;
      if (!video) {
        return;
      }
      video.pause();
      video.srcObject = null;
      const chunks = chunksRef.current;
      if (!chunks) {
        return;
      }
      let newChunks = chunks.slice();
      const [firstChunk] = newChunks;
      const mimeType = firstChunk.type || mediaRecorder.mimeType || 'video/mp4';
      const blob = new Blob(newChunks, { type: mimeType });
      const url = URL.createObjectURL(blob);
      chunks.length = 0;
      onChange({ data: url });
    },
    [mediaRecorder, videoRef, chunksRef, onChange],
  );

  const onRecorderData = useCallback(
    /** @param {{ data: Blob }} e */
    function onRecorderData(e) {
      const chunks = chunksRef.current;
      if (!chunks) {
        return;
      }
      chunks.push(e.data);
    },
    [chunksRef],
  );

  useEffect(() => {
    if (!mediaRecorder) {
      return;
    }
    mediaRecorder.addEventListener('stop', onRecorderStop);
    mediaRecorder.addEventListener('dataavailable', onRecorderData);
    mediaRecorder.addEventListener('start', onRecorderStart);
    const video = videoRef.current;
    if (video) {
      video.srcObject = mediaRecorder.stream;
      video.play();
    }
    return () => {
      if (video) {
        video.srcObject = null;
        video.pause();
      }
      mediaRecorder.removeEventListener('stop', onRecorderStop);
      mediaRecorder.removeEventListener('dataavailable', onRecorderData);
      mediaRecorder.removeEventListener('start', onRecorderStart);
    };
  }, [mediaRecorder, onRecorderStart, onRecorderStop, onRecorderData]);

  const onClick = useCallback(
    /** @param {MouseEvent} e */
    function onClick(e) {
      if (!mediaRecorder) {
        return;
      }
      setOpen(true);
      setRecording(false);
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    [mediaRecorder, setOpen, setRecording],
  );

  const onStartClick = useCallback(
    /** @param {MouseEvent} e */
    function onStopClick(e) {
      if (!mediaRecorder) {
        return;
      }
      mediaRecorder.start();
      setOpen(true);
      setRecording(true);
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    [mediaRecorder, setOpen, setRecording],
  );

  const onStopClick = useCallback(
    /** @param {MouseEvent} e */
    function onStopClick(e) {
      if (!mediaRecorder) {
        return;
      }
      mediaRecorder.stop();
      setOpen(false);
      setRecording(false);
      e.preventDefault();
      e.stopPropagation();
      return false;
    },
    [mediaRecorder, setOpen, setRecording],
  );

  return (
    <>
      <div
        className={
          'fixed m-auto z-10 w-full h-full' + ' ' + (open ? 'block' : 'hidden')
        }>
        <video ref={videoRef} className="m-auto w-[60vmin] h-[60vmin]">
          Video stream not available.
        </video>
        <div className="flex w-full">
          <button
            className="flex-1 border-2 p-2 disabled:opacity-30"
            onClick={onStartClick}
            disabled={!open || recording}>
            Start
          </button>
          <button
            className="flex-1 border-2 p-2 disabled:opacity-30"
            onClick={onStopClick}
            disabled={!open}>
            Stop
          </button>
        </div>
      </div>
      <Button title="Record" className={className} onClick={onClick} />
    </>
  );
}
