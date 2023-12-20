import { useContext } from 'react';

import { MediaRecorderContext } from './MediaRecorderContext';

export function useMediaRecorderV2() {
  let result = useContext(MediaRecorderContext);
  if (!result) {
    throw new Error('Missing <MediaRecorderProvider/>');
  }
  return result;
}
