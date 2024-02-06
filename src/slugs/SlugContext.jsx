import { createTypedContext } from '@/utils/ReactContextHelper';

import { useSlugContextValue } from './SlugContextValue';

export const SlugContext = createTypedContext(useSlugContextValue);
