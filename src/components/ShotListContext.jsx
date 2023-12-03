'use client';

import { createContext, useContext, useState } from 'react';

import { createShotTake } from './ShotTake';

const ShotListContext = createContext(
  /** @type {ReturnType<useShotListAPI>|null} */ (null),
);

const TEST_VALUES = [
  createShotTake(0, 1, 1, 0),
  createShotTake(0, 2, 1, 1),
  createShotTake(0, 2, 1, 2),
  createShotTake(0, 3, 1, 0),
  createShotTake(0, 4, 1, 1),
  createShotTake(0, 4, 2, 1),
  createShotTake(0, 4, 3, 1),
  createShotTake(0, 4, 4, 1),
  createShotTake(0, 4, 4, 2),
  createShotTake(0, 4, 4, 3),
  createShotTake(0, 4, 4, 4),
];

function useShotListAPI() {
  const [shotList, setShotList] = useState(
    /** @type {Array<import('./ShotTake').ShotTake>} */ (TEST_VALUES),
  );
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
