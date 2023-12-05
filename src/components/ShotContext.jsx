'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ShotTakeContext = createContext(
  /** @type {ReturnType<useShotTakeAPI>|null} */ (null),
);

export const SHOT_TAKE_SESSION_STORAGE_KEY = 'currentShotTake';

/**
 * @param {number} scene
 * @param {number} shot
 */
export function getShotTakeId(scene, shot) {
  return `sst-${scene}.${shot}`;
}

function useShotTakeAPI() {
  const [state, setState] = useState({ title: '', scene: 0, shot: 0, take: 0 });
  const loadOnceRef = useRef(false);

  useEffect(() => {
    if (!loadOnceRef.current) {
      loadOnceRef.current = true;
      let shotTakeString = sessionStorage.getItem(
        SHOT_TAKE_SESSION_STORAGE_KEY,
      );
      if (!shotTakeString) {
        return;
      }
      try {
        let result = JSON.parse(shotTakeString);
        setState({
          title: result.title || 'Untitled',
          scene: result.scene || 0,
          shot: result.shot || 0,
          take: result.take || 0,
        });
      } catch (e) {
        // Do nothin.
      }
      return;
    }

    sessionStorage.setItem(
      SHOT_TAKE_SESSION_STORAGE_KEY,
      JSON.stringify(state),
    );
  }, [state, setState]);

  return {
    shotTake: state,
    setShotTake: setState,
  };
}

/**
 * @param {object} props
 * @param {import('react').ReactNode} props.children
 */
export function ShotTakeProvider({ children }) {
  const api = useShotTakeAPI();
  return (
    <ShotTakeContext.Provider value={api}>{children}</ShotTakeContext.Provider>
  );
}

export function useShotTake() {
  let result = useContext(ShotTakeContext);
  if (!result) {
    throw new Error('Mising ShotTakeContext Provider!');
  }
  return result;
}
