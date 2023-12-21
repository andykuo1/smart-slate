import { useCallback, useRef } from 'react';

/**
 * @callback MediaRecorderCompleteCallback
 * @param {Blob} blob
 * @param {MediaRecorder} mediaRecorder
 */

/**
 * @param {import('react').RefObject<MediaStream|null>} mediaStreamRef
 * @param {MediaRecorderCompleteCallback} onComplete
 * @returns {[import('react').RefObject<MediaRecorder|null>, (options: MediaRecorderOptions) => Promise<MediaRecorder>, (dataOptions: BlobPropertyBag) => Promise<void>]}
 */
export function useMediaRecorder(mediaStreamRef, onComplete) {
  const ref = useRef(/** @type {MediaRecorder|null} */ (null));
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

  const stop = useCallback(
    /** @param {BlobPropertyBag} dataOptions */
    async function stop(dataOptions) {
      if (!ref.current) {
        return null;
      }
      const mediaRecorder = ref.current;
      ref.current = null;
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
            let blob = compileDataBlobs(dataBlobs, dataOptions);
            onComplete(blob, mediaRecorder);
          }
          resolve(mediaRecorder);
        }
        mediaRecorder.addEventListener('stop', onMediaRecorderStop);
        mediaRecorder.addEventListener('error', reject);
        mediaRecorder.stop();
      });
    },
    [
      ref,
      dataBlobsRef,
      onComplete,
      onMediaRecorderDataAvailable,
      onMediaRecorderError,
    ],
  );

  const start = useCallback(
    /** @param {MediaRecorderOptions} options */
    async function start(options) {
      if (ref.current) {
        await stop({});
      }
      if (!mediaStreamRef.current) {
        throw new Error('Missing media stream for recorder.');
      }
      const mediaStream = mediaStreamRef.current;
      const mediaRecorder = new MediaRecorder(mediaStream, options);
      ref.current = mediaRecorder;
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
          resolve(mediaRecorder);
        }
        mediaRecorder.addEventListener('start', onMediaRecorderStart);
        mediaRecorder.addEventListener('error', reject);
        mediaRecorder.start();
      });
    },
    [
      ref,
      mediaStreamRef,
      onMediaRecorderDataAvailable,
      onMediaRecorderError,
      stop,
    ],
  );

  return [ref, start, stop];
}

/**
 * @param {Array<Blob>} dataBlobs
 * @param {BlobPropertyBag} dataOptions
 */
function compileDataBlobs(dataBlobs, dataOptions) {
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
