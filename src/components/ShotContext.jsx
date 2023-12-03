'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/** @type {import('react').Context<ReturnType<useShotTakeAPI>|null>} */
const ShotTakeContext = createContext(null);

export const SHOT_TAKE_SESSION_STORAGE_KEY = 'currentShotTake';
export function getShotTakeId(scene, shot) {
  return `sst-${scene}.${shot}`;
}

function useShotTakeAPI() {
  const [state, setState] = useState({ scene: 0, shot: 0, take: 0 });

  useEffect(() => {
    let shotTakeString = sessionStorage.getItem(SHOT_TAKE_SESSION_STORAGE_KEY);
    if (shotTakeString) {
      try {
        let result = JSON.parse(shotTakeString);
        let take = sessionStorage.getItem(
          getShotTakeId(result.scene, result.shot),
        );
        setState({
          scene: result.scene || 0,
          shot: result.shot || 0,
          take: take,
        });
      } catch (e) {
        // Do nothin.
      }
    } else {
      sessionStorage.setItem(
        SHOT_TAKE_SESSION_STORAGE_KEY,
        JSON.stringify(state),
      );
    }
  }, []);

  return {
    state,
    setStateImpl: setState,
  };
}

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
