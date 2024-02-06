import { createTypedContext } from '@/utils/ReactContextHelper';

import { useVideoCacheContextValue } from './VideoCacheContextValue';

export const VideoCacheContext = createTypedContext(useVideoCacheContextValue);
