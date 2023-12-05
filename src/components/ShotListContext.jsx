'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ShotListContext = createContext(
  /** @type {ReturnType<useShotListAPI>|null} */ (null),
);

const SHOT_LIST_LOCAL_STORAGE_KEY = 'storedShotList';

function useShotListAPI() {
  const [shotList, setShotList] = useState(
    /** @type {Array<import('./ShotTake').ShotTake>} */ ([]),
  );
  const loadOnceRef = useRef(false);

  useEffect(() => {
    if (!loadOnceRef.current) {
      loadOnceRef.current = true;

      let string = localStorage.getItem(SHOT_LIST_LOCAL_STORAGE_KEY);
      if (!string) {
        return;
      }
      let json = JSON.parse(string);
      setShotList(json);
      return;
    }

    let json = JSON.stringify(shotList);
    localStorage.setItem(SHOT_LIST_LOCAL_STORAGE_KEY, json);
  }, [shotList]);

  return {
    shotList,
    setShotList,
  };
}

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function ShotListProvider({ children }) {
  const value = useShotListAPI();
  return (
    <ShotListContext.Provider value={value}>
      {children}
    </ShotListContext.Provider>
  );
}

export function useShotList() {
  let result = useContext(ShotListContext);
  if (!result) {
    throw new Error('Missing ShotListContext provider.');
  }
  return result;
}
