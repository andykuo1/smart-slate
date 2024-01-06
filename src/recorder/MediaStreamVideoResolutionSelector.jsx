import { useCallback, useContext, useEffect, useState } from 'react';

import {
  STANDARD_VIDEO_RESOLUTIONS,
  getNearestStandardVideoResolution,
  getStandardVideoResolutionByDimension,
  getStandardVideoResolutionByName,
} from '@/values/Resolutions';

import { RecorderContext } from './RecorderContext';

/**
 * @param {object} props
 * @param {string} [props.className]
 * @param {(resolution: import('@/values/Resolutions').VideoResolution) => void} props.onChange
 */
export default function MediaStreamVideoResolutionSelector({
  className,
  onChange,
}) {
  const [value, setValue] = useState('');
  const { mediaStream } = useContext(RecorderContext);

  // Initialize value to mediaStream's settings
  useEffect(() => {
    if (!mediaStream) {
      return;
    }
    const videoTracks = mediaStream.getVideoTracks();
    if (!videoTracks || videoTracks.length <= 0) {
      return;
    }
    const firstVideoTrack = videoTracks[0];
    const { width, height } = firstVideoTrack.getSettings();
    const { width: supportedWidth, height: supportedHeight } =
      firstVideoTrack.getCapabilities();
    const firstResolution = getStandardVideoResolutionByDimension(
      width || 0,
      height || 0,
    );
    const currentResolution = getStandardVideoResolutionByName(value);
    if (currentResolution && supportedWidth && supportedHeight) {
      if (
        isVideoResolutionSupported(
          currentResolution,
          supportedWidth,
          supportedHeight,
        )
      ) {
        let nearestResolution = getNearestStandardVideoResolution(
          supportedWidth.max || 0,
          supportedHeight.max || 0,
        );
        if (
          nearestResolution &&
          nearestResolution.name !== currentResolution.name
        ) {
          setValue(nearestResolution.name);
          return;
        }
      }
    }
    if (!currentResolution && !firstResolution) {
      // Nothing exists, so reset everything.
      setValue('');
      return;
    } else if (currentResolution && !firstResolution) {
      // Video track didn't have a standard resolution...
      onChange(currentResolution);
      return;
    } else if (!currentResolution && firstResolution) {
      // Current value is unset, so match the source video.
      setValue(firstResolution.name);
      return;
    } else if (currentResolution && firstResolution) {
      if (currentResolution.name !== firstResolution.name) {
        // Both exist, so prefer the standard resolution.
        onChange(currentResolution);
      } else {
        // Do nothing! They are both the same!
      }
      return;
    }
  }, [value, mediaStream, onChange]);

  const handleChange = useCallback(
    /** @type {import('react').ChangeEventHandler<HTMLSelectElement>} */
    function _handleChange(e) {
      const target = e.target;
      const value = target.value;
      setValue(value);
    },
    [setValue],
  );

  return (
    <select className={className} value={value} onChange={handleChange}>
      {Object.keys(STANDARD_VIDEO_RESOLUTIONS).map((key) => (
        <SupportedVideoResolutionOption key={key} resolutionName={key} />
      ))}
    </select>
  );
}

/**
 * @param {object} props
 * @param {string} props.resolutionName
 */
function SupportedVideoResolutionOption({ resolutionName }) {
  const { mediaStream } = useContext(RecorderContext);
  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    const currentResolution = getStandardVideoResolutionByName(resolutionName);
    if (!currentResolution) {
      if (isSupported) {
        setIsSupported(false);
      }
      return;
    }
    if (!mediaStream) {
      if (isSupported) {
        setIsSupported(false);
      }
      return;
    }
    const videoTracks = mediaStream.getVideoTracks();
    if (!videoTracks || videoTracks.length <= 0) {
      if (isSupported) {
        setIsSupported(false);
      }
      return;
    }
    const firstVideoTrack = videoTracks[0];
    const { width: supportedWidth, height: supportedHeight } =
      firstVideoTrack.getCapabilities();
    if (
      isVideoResolutionSupported(
        currentResolution,
        supportedWidth,
        supportedHeight,
      )
    ) {
      if (isSupported) {
        setIsSupported(false);
      }
    } else {
      if (!isSupported) {
        setIsSupported(true);
      }
    }
  }, [isSupported, resolutionName, mediaStream]);
  return (
    <option value={resolutionName} disabled={!isSupported}>
      {resolutionName + (!isSupported ? ' (Unsupported)' : '')}
    </option>
  );
}

/**
 *
 * @param {import('@/values/Resolutions').VideoResolution} resolution
 * @param {ULongRange|undefined} supportedWidthRange
 * @param {ULongRange|undefined} supportedHeightRange
 */
function isVideoResolutionSupported(
  resolution,
  supportedWidthRange,
  supportedHeightRange,
) {
  if (!supportedWidthRange || !supportedHeightRange) {
    return false;
  }
  if (
    resolution.width < (supportedWidthRange.min || 0) ||
    resolution.width > (supportedWidthRange.max || Number.POSITIVE_INFINITY) ||
    resolution.height < (supportedHeightRange.min || 0) ||
    resolution.height > (supportedHeightRange.max || Number.POSITIVE_INFINITY)
  ) {
    return false;
  } else {
    return true;
  }
}
