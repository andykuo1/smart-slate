import { FullscreenContext } from './FullscreenContext';
import { useFullscreenProvider } from './UseFullscreenContextValue';

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function FullscreenProvider({ children }) {
  const value = useFullscreenProvider();
  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
}
