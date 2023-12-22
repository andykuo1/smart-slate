import { createContext } from '@/utils/ReactContextHelper';

import { useMediaRecorderContextValue } from './MediaRecorderContextValue';

export const MediaRecorderContext = createContext(useMediaRecorderContextValue);
