import { createContext, useContext, useEffect, useRef, useState } from 'react';

import { createStore } from './DocumentStore';

const DocumentStoreContext = createContext(
  /** @type {ReturnType<useDocumentStoreContextValue>|null} */ (null),
);

const DOCUMENT_STORE_KEY = 'documentStore';

function useDocumentStoreContextValue() {
  const [state, setState] = useState(createStore());
  const loadOnceRef = useRef(false);

  useEffect(() => {
    if (loadOnceRef.current) {
      return;
    }
    loadOnceRef.current = true;

    // Load from localStorage!
    let store = loadStoreFromLocalStorage();
    setState(store);
  }, [loadOnceRef, setState]);

  useEffect(() => {
    // Save to localStorage on interval!
    let handle = setInterval(() => saveStoreToLocalStorage(state), 1_000);
    return () => clearInterval(handle);
  }, [state]);

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

function loadStoreFromLocalStorage() {
  let item = localStorage.getItem(DOCUMENT_STORE_KEY);
  if (!item) {
    return createStore();
  }
  let json = JSON.parse(item);
  return json;
}

/**
 * @param {object} store
 */
function saveStoreToLocalStorage(store) {
  localStorage.setItem(DOCUMENT_STORE_KEY, JSON.stringify(store));
}
