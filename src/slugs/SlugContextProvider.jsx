import { SlugContext } from './SlugContext';
import { useSlugContextValue } from './SlugContextValue';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export default function SlugContextProvider({ children }) {
  const value = useSlugContextValue();
  return <SlugContext.Provider value={value}>{children}</SlugContext.Provider>;
}
