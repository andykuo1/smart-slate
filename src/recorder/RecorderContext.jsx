import { createTypedContext } from '@/utils/ReactContextHelper';

import { useRecorderContextValue } from './RecorderContextValue';

export const RecorderContext = createTypedContext(useRecorderContextValue);
