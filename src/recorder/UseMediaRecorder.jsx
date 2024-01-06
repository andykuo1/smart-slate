import { useCallback, useRef, useState } from 'react';

/**
 * @param {import('react').RefObject<MediaStream|null>} mediaStreamRef
 */
export function useMediaRecorder(mediaStreamRef) {
  const [mediaRecorder, setMediaRecorder] = useState(
    /** @type {MediaRecorder|null} */ (null),
  );
  const mediaRecorderRef = useRef(/** @type {MediaRecorder|null} */ (null));
  const dataBlobsRef = useRef(/** @type {Array<Blob>} */ ([]));

  const onMediaRecorderDataAvailable = useCallback(
    /** @param {MediaRecorderEventMap['dataavailable']} e */
    function _onMediaRecorderDataAvailable(e) {
      if (e.data.size > 0) {
        dataBlobsRef.current.push(e.data);
      }
    },
    [dataBlobsRef],
  );

  const onMediaRecorderError = useCallback(
    /** @param {MediaRecorderEventMap['error']} e */
    function _onMediaRecorderError(e) {
      const mediaRecorder = /** @type {MediaRecorder} */ (e.target);
      if (!mediaRecorder) {
        return;
      }
      // TODO: Errors are just consumed :( what are all the possible errors for media recorder?
      console.error(e);
    },
    [],
  );

  /** @type {(blobOptions?: BlobPropertyBag) => Promise<{ value: Blob|null, target: MediaRecorder|null }>} */
  const stopMediaRecorder = useCallback(
    async function _stopMediaRecorder(blobOptions = {}) {
      const mediaRecorder = mediaRecorderRef.current;
      if (!mediaRecorder) {
        return { value: null, target: null };
      }
      mediaRecorderRef.current = null;
      setMediaRecorder(null);
      return new Promise((resolve, reject) => {
        /** @param {MediaRecorderEventMap['start']} e */
        function onMediaRecorderStop(e) {
          const mediaRecorder = /** @type {MediaRecorder} */ (e.target);
          mediaRecorder.removeEventListener('error', reject);
          mediaRecorder.removeEventListener('stop', onMediaRecorderStop);
          // Ignore any future errors!
          mediaRecorder.removeEventListener('error', onMediaRecorderError);
          // Ignore any future data!
          mediaRecorder.removeEventListener(
            'dataavailable',
            onMediaRecorderDataAvailable,
          );
          // and capture it!
          if (dataBlobsRef.current && dataBlobsRef.current.length > 0) {
            let dataBlobs = dataBlobsRef.current;
            dataBlobsRef.current = [];
            let blob = compileDataBlobs(dataBlobs, blobOptions);
            resolve({ value: blob, target: mediaRecorder });
          } else {
            resolve({ value: null, target: mediaRecorder });
          }
        }
        mediaRecorder.addEventListener('stop', onMediaRecorderStop);
        mediaRecorder.addEventListener('error', reject);
        mediaRecorder.stop();
      });
    },
    [
      mediaRecorderRef,
      dataBlobsRef,
      onMediaRecorderDataAvailable,
      onMediaRecorderError,
    ],
  );

  /** @type {(options?: MediaRecorderOptions) => Promise<{ target: MediaRecorder }>} */
  const startMediaRecorder = useCallback(
    /** @param {MediaRecorderOptions} [options] */
    async function _startMediaRecorder(options = undefined) {
      if (mediaRecorderRef.current) {
        // NOTE: The result of this is thrown away :(
        await stopMediaRecorder();
      }
      if (!mediaStreamRef.current) {
        throw new Error('Missing media stream for recorder.');
      }
      const mediaStream = mediaStreamRef.current;
      const mediaRecorder = new MediaRecorder(mediaStream, options);
      mediaRecorderRef.current = mediaRecorder;
      setMediaRecorder(mediaRecorder);
      return new Promise((resolve, reject) => {
        /** @param {MediaRecorderEventMap['start']} e */
        function onMediaRecorderStart(e) {
          const mediaRecorder = /** @type {MediaRecorder} */ (e.target);
          mediaRecorder.removeEventListener('error', reject);
          mediaRecorder.removeEventListener('start', onMediaRecorderStart);
          // Listen for future errors!
          mediaRecorder.addEventListener('error', onMediaRecorderError);
          // Listen for future data!
          mediaRecorder.addEventListener(
            'dataavailable',
            onMediaRecorderDataAvailable,
          );
          resolve({ target: mediaRecorder });
        }
        mediaRecorder.addEventListener('start', onMediaRecorderStart);
        mediaRecorder.addEventListener('error', reject);
        mediaRecorder.start();
      });
    },
    [
      mediaRecorderRef,
      mediaStreamRef,
      onMediaRecorderDataAvailable,
      onMediaRecorderError,
      stopMediaRecorder,
    ],
  );

  return {
    mediaRecorder,
    mediaRecorderRef,
    startMediaRecorder,
    stopMediaRecorder,
  };
}

/**
 * @param {Array<Blob>} dataBlobs
 * @param {BlobPropertyBag} [dataOptions]
 */
export function compileDataBlobs(dataBlobs, dataOptions = {}) {
  if (dataBlobs.length > 0) {
    let firstBlob = dataBlobs[0];
    let blobPropertyBag = {
      type: firstBlob.type,
      ...dataOptions,
    };
    return new Blob(dataBlobs, blobPropertyBag);
  } else {
    return new Blob();
  }
}
