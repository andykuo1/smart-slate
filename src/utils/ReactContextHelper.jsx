import { createContext as createContextImpl } from 'react';

/**
 * @template T
 * @param {import('react').Context<T>} Context
 * @param {() => T} useValue
 */
export function createProvider(Context, useValue) {
  /**
   * @param {object} props
   * @param {import('react').ReactNode} props.children
   */
  return function ContextProvider({ children }) {
    const value = useValue();
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
}

/**
 * @template T
 * @param {() => T} useValue
 */
export function createTypedContext(useValue) {
  return createContextImpl(/** @type {T} */ (null));
}
