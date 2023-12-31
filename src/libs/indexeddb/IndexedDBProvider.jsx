import { IndexedDBContext } from './IndexedDBContext';
import { useIndexedDBContextValue } from './UseIndexedDBContextValue';

/**
 * @param {object} props
 * @param {string} props.name
 * @param {number} props.version
 * @param {import('react').ReactNode} props.children
 */
export function IndexedDBProvider({ name, version, children }) {
  const value = useIndexedDBContextValue(name, version);
  return (
    <IndexedDBContext.Provider value={value}>
      {children}
    </IndexedDBContext.Provider>
  );
}
