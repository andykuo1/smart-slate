import { useContext, useEffect, useState } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {(videoDeviceId: string) => void} props.onChange
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
export default function MediaStreamAudioDeviceSelector({
  className,
  onChange,
  disabled,
}) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { mediaStream, audioDeviceId } = useContext(RecorderContext);

  useEffect(() => {
    if (!mediaStream) {
      setDeviceList([]);
      return;
    }
    if (
      typeof window !== 'undefined' &&
      typeof window?.navigator?.mediaDevices?.enumerateDevices === 'function'
    ) {
      window.navigator.mediaDevices
        .enumerateDevices()
        .then((infos) =>
          setDeviceList(infos.filter((info) => info.kind === 'audioinput')),
        );
      return () => setDeviceList([]);
    }
  }, [mediaStream, setDeviceList]);

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  function changeCallback(e) {
    const target = e.target;
    const value = target.value;
    onChange(value);
  }

  return (
    <select
      className={className}
      value={audioDeviceId}
      onChange={changeCallback}
      disabled={disabled}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Microphone ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}
