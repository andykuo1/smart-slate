import { useContext, useEffect, useState } from 'react';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {(videoDeviceId: string) => void} props.onChange
 * @param {string} [props.className]
 * @param {boolean} [props.disabled]
 */
export default function MediaStreamVideoDeviceSelector({
  className,
  onChange,
  disabled,
}) {
  const [deviceList, setDeviceList] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );

  const { mediaStream, videoDeviceId } = useContext(RecorderContext);

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
          setDeviceList(infos.filter((info) => info.kind === 'videoinput')),
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
      value={videoDeviceId}
      onChange={changeCallback}
      disabled={disabled}>
      {deviceList.map((deviceInfo, index) => (
        <option key={deviceInfo.deviceId} value={deviceInfo.deviceId}>
          {deviceInfo.label || 'Camera ' + (index + 1)}
        </option>
      ))}
    </select>
  );
}
