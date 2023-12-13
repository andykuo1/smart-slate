import { useCallback, useEffect, useRef } from 'react';

/** @typedef {'idle'|'preparing_streams'|'ready'|'starting'|'recording'|'stopping'|'stopped'|Error} MediaRecorderStatus */

/**
 * @param {object} props
 * @param {MediaStreamConstraints} [props.mediaStreamConstraints]
 * @param {MediaRecorderOptions} [props.mediaRecorderOptions]
 * @param {BlobPropertyBag} [props.blobOptions]
 * @param {(mediaRecorder: MediaRecorder) => void} [props.onStart]
 * @param {(blob: Blob) => void} props.onStop
 * @param {(blob: Blob) => void} [props.onDataAvailable]
 * @param {(status: MediaRecorderStatus) => void} [props.onStatus]
 */
export function useMediaRecorder({
  mediaStreamConstraints = { audio: true, video: true },
  mediaRecorderOptions = {},
  blobOptions = {},
  onStart,
  onStop,
  onDataAvailable,
  onStatus,
}) {
  const blobParts = useRef(/** @type {Array<Blob>} */ ([]));
  const mediaStream = useRef(/** @type {MediaStream|null} */ (null));
  const mediaRecorder = useRef(/** @type {MediaRecorder|null} */ (null));

  const onDataAvailableImpl = useCallback(
    /** @param {BlobEvent} e */
    function onDataAvailableImpl(e) {
      if (e.data.size > 0) {
        blobParts.current.push(e.data);
      }
      if (onDataAvailable) {
        onDataAvailable(e.data);
      }
    },
    [onDataAvailable],
  );

  const onErrorImpl = useCallback(
    /** @param {Event|{ error: any }} e */
    function onErrorImpl(e) {
      // @ts-ignore
      let error = e?.error || e;
      if (!(error instanceof Error)) {
        error = new Error(error);
      }
      if (onStatus) {
        onStatus(error);
      }
    },
    [onStatus],
  );

  const onStopImpl = useCallback(
    /** @param {Event} e */
    function _onStopImpl(e) {
      const mr = /** @type {MediaRecorder|null} */ (e.target);
      mr?.removeEventListener('stop', onStopImpl);
      mr?.removeEventListener('dataavailable', onDataAvailableImpl);
      mr?.removeEventListener('error', onErrorImpl);

      let ms = mediaStream.current;
      mediaStream.current = null;
      ms?.getTracks().forEach((track) => track.stop());

      const blobs = blobParts.current;
      let blob;
      if (blobs.length > 0) {
        let firstBlob = blobs[0];
        let blobPropertyBag = {
          type: firstBlob.type,
          ...blobOptions,
        };
        blob = new Blob(blobs, blobPropertyBag);
      } else {
        blob = new Blob();
      }
      if (onStatus) {
        onStatus('stopped');
      }
      if (onStop) {
        onStop(blob);
      }
    },
    [blobOptions, onDataAvailableImpl, onErrorImpl, onStop, onStatus],
  );

  const onStartImpl = useCallback(
    /** @param {Event} e */
    function _onStartImpl(e) {
      const mr = /** @type {MediaRecorder|null} */ (e.target);
      mr?.removeEventListener('start', onStartImpl);
      mr?.addEventListener('stop', onStopImpl);
      mr?.addEventListener('dataavailable', onDataAvailableImpl);
      mr?.addEventListener('error', onErrorImpl);

      if (onStatus) {
        onStatus('recording');
      }
      if (onStart && mr) {
        onStart(mr);
      }
    },
    [onStopImpl, onDataAvailableImpl, onErrorImpl, onStart, onStatus],
  );

  const prepareRecording = useCallback(
    async function prepareRecording() {
      if (onStatus) {
        onStatus('preparing_streams');
      }
      let ms = null;
      try {
        ms = await window.navigator.mediaDevices.getUserMedia(
          mediaStreamConstraints,
        );
        mediaStream.current = ms;
        if (onStatus) {
          onStatus('ready');
        }
      } catch (e) {
        onErrorImpl({ error: e });
      }
      return ms;
    },
    [mediaStreamConstraints, onErrorImpl, onStatus],
  );

  const startRecording = useCallback(
    async function startRecording(timeslice = undefined) {
      if (onStatus) {
        onStatus('starting');
      }
      if (!mediaStream.current) {
        await prepareRecording();
      }
      blobParts.current = [];
      if (!mediaStream.current) {
        return;
      }
      let mr = new MediaRecorder(mediaStream.current, mediaRecorderOptions);
      mediaRecorder.current = mr;
      mr.addEventListener('start', onStartImpl);

      try {
        mr.start(timeslice);
      } catch (e) {
        onErrorImpl({ error: e });
      }
    },
    [
      mediaRecorderOptions,
      prepareRecording,
      onErrorImpl,
      onStartImpl,
      onStatus,
    ],
  );

  const stopRecording = useCallback(
    function stopRecording() {
      if (!mediaRecorder.current) {
        return;
      }
      let mr = mediaRecorder.current;
      mediaRecorder.current = null;
      if (onStatus) {
        onStatus('stopping');
      }
      mr.stop();
    },
    [onStatus],
  );

  useEffect(() => {
    try {
      tryValidateMediaRecorderFeatures(
        mediaRecorderOptions,
        mediaStreamConstraints,
      );
    } catch (e) {
      if (onStatus) {
        onStatus(
          new Error('Failed MediaRecorder feature validation', { cause: e }),
        );
      } else {
        throw e;
      }
    }
  }, [mediaStreamConstraints, mediaRecorderOptions, onStatus]);

  return {
    prepareRecording,
    startRecording,
    stopRecording,
  };
}

/**
 * @param {MediaRecorderOptions} mediaRecorderOptions
 * @param {MediaStreamConstraints} mediaStreamConstraints
 */
export function tryValidateMediaRecorderFeatures(
  mediaRecorderOptions,
  mediaStreamConstraints,
) {
  if (!window.MediaRecorder) {
    throw new Error(
      'MediaRecorder is not supported. Please update to the latest version of your browser.',
    );
  }
  if (typeof mediaStreamConstraints?.video === 'object') {
    tryValidateMediaRecorderConstraints(mediaStreamConstraints.video);
  }
  if (typeof mediaStreamConstraints?.audio === 'object') {
    tryValidateMediaRecorderConstraints(mediaStreamConstraints.audio);
  }
  if (
    mediaRecorderOptions &&
    mediaRecorderOptions.mimeType &&
    !MediaRecorder.isTypeSupported(mediaRecorderOptions.mimeType)
  ) {
    throw new Error(
      `MIME type '${mediaRecorderOptions.mimeType}' is not supported by this browser.`,
    );
  }
}

/**
 * @param {Partial<MediaTrackConstraints>} constraints
 */
function tryValidateMediaRecorderConstraints(constraints) {
  const supportedConstraints =
    navigator.mediaDevices?.getSupportedConstraints();
  if (!supportedConstraints) {
    throw new Error('No supported constraints for navigator.mediaDevices');
  }
  let unsupported = [];
  for (let key of Object.keys(constraints)) {
    let value =
      supportedConstraints[
        /** @type {keyof MediaTrackSupportedConstraints} */ (key)
      ];
    if (!value) {
      unsupported.push(key);
    }
  }
  if (unsupported.length > 0) {
    throw new Error(
      `Requested constraints not supported for navigator.mediaDevices - ${unsupported.join(
        ', ',
      )}.`,
    );
  }
}

/**
 * @param {Array<string>} possibleTypes
 */
export function getMediaRecorderSupportedMimeType(possibleTypes) {
  if (typeof window.MediaRecorder === 'undefined') {
    return '';
  }

  for (let type of possibleTypes) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }

  return '';
}
