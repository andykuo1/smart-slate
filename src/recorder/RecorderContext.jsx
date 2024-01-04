import { createContext } from '@/utils/ReactContextHelper';

import { useRecorderContextValue } from './RecorderContextValue';

export const RecorderContext = createContext(useRecorderContextValue);
