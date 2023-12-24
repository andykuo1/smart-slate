import { VideoCacheContext } from './VideoCacheContext';
import { useVideoCacheContextValue } from './VideoCacheContextValue';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function VideoCacheProvider({ children }) {
  const value = useVideoCacheContextValue();
  return (
    <VideoCacheContext.Provider value={value}>
      {children}
    </VideoCacheContext.Provider>
  );
}
