import { createContext } from '@/utils/ReactContextHelper';

import { useVideoCacheContextValue } from './VideoCacheContextValue';

export const VideoCacheContext = createContext(useVideoCacheContextValue);
