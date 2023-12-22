import { createProvider } from '../utils/ReactContextHelper';
import { MediaRecorderContext } from './MediaRecorderContext';
import { useMediaRecorderContextValue } from './MediaRecorderContextValue';

export const MediaRecorderProvider = createProvider(
  MediaRecorderContext,
  useMediaRecorderContextValue,
);
