'use client';

import { createContext, useContext, useEffect, useState } from 'react';

/** @type {import('react').Context<ReturnType<useShotTakeAPI>|null>} */
const ShotTakeContext = createContext(null);

const SHOT_TAKE_SESSION_STORAGE_KEY = 'currentShotTake';

function useShotTakeAPI() {
  const [state, setState] = useState({ scene: 0, shot: 0, take: 0 });

  useEffect(() => {
    let shotTakeString = sessionStorage.getItem(SHOT_TAKE_SESSION_STORAGE_KEY);
    if (shotTakeString) {
      try {
        let result = JSON.parse(shotTakeString);
        setState({
          scene: result.scene || 0,
          shot: result.shot || 0,
          take: result.take || 0,
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

  function updateState(state) {
    setState((prev) => {
      let next = { ...prev, ...state };
      let shotTakeId = 'sst-' + state.scene + '.' + state.shot;
      let result = sessionStorage.getItem(shotTakeId);
      if (!result) {
        result = 0;
      }
      next.take = result;
      sessionStorage.setItem(
        SHOT_TAKE_SESSION_STORAGE_KEY,
        JSON.stringify(next),
      );
      return next;
    });
  }

  /**
   * @param {(state: { scene: number, shot: number, take: number }) => void} callback
   */
  function fetchState(callback) {
    setState((prev) => {
      callback(prev);
      return prev;
    });
  }

  return {
    state,
    setState: setState,
    setStateImpl: setState,
    getState: fetchState,
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
