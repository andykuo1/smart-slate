import { createContext, useCallback, useContext, useState } from 'react';

import { VERSION } from '@/constants/PackageJSON';

import { useAutoSave } from '../hooks/autosave';
import { cloneStore, createStore } from './DocumentStore';

const DocumentStoreContext = createContext(
  /** @type {ReturnType<useDocumentStoreContextValue>|null} */ (null),
);

const DOCUMENT_STORE_KEY = 'documentStore';

function useDocumentStoreContextValue() {
  const [state, setState] = useState(createStore());

  const ser = useCallback(
    /** @type {import('../hooks/autosave/UseAutoSave').SerializerFunction} */
    function ser(dst) {
      cloneStore(dst, state);
      dst.metadata = {
        timestamp: Date.now(),
        version: VERSION,
      };
    },
    [state, VERSION],
  );

  const der = useCallback(
    /** @type {import('../hooks/autosave/UseAutoSave').DeserializerFunction} */
    function der(src) {
      setState(src);
    },
    [setState],
  );

  useAutoSave(DOCUMENT_STORE_KEY, ser, der);

  return {
    store: state,
    setStore: setState,
  };
}

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function DocumentStoreProvider({ children }) {
  const value = useDocumentStoreContextValue();
  return (
    <DocumentStoreContext.Provider value={value}>
      {children}
    </DocumentStoreContext.Provider>
  );
}

export function useDocumentStore() {
  let result = useContext(DocumentStoreContext);
  if (!result) {
    throw new Error('Missing DocumentStoreContext provider.');
  }
  return result;
}
