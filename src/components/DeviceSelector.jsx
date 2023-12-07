import { useState } from 'react';
import { useCallback } from 'react';
import { useRef } from 'react';
import { useEffect } from 'react';

/**
 * @param {object} props
 * @param {(deviceId: string) => void} props.onDeviceChange
 */
export function DeviceSelector({ onDeviceChange }) {
  const [devices, setDevices] = useState(
    /** @type {Array<MediaDeviceInfo>} */ ([]),
  );
  const onceRef = useRef(false);
  useEffect(() => {
    if (onceRef.current) {
      return;
    }
    onceRef.current = true;
    navigator.mediaDevices
      .enumerateDevices()
      .then((value) => setDevices(value));
  });

  /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
  const onChange = useCallback(
    (e) => {
      const el = e.target;
      onDeviceChange(el.value);
    },
    [onDeviceChange],
  );

  return (
    <select onChange={onChange}>
      {devices
        .filter((device) => device.kind === 'videoinput')
        .map((device, index) => (
          <option value={device.deviceId}>Video Input {index}</option>
        ))}
    </select>
  );
}
