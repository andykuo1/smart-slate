import { useContext } from 'react';

import { InputCaptureContext } from './InputCaptureContext';

export function useInputCapture() {
  let result = useContext(InputCaptureContext);
  if (!result) {
    throw new Error('Missing <InputCaptureProvider/>');
  }
  return result;
}
