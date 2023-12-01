import { createContext, useContext, useEffect, useState } from 'react';

const ShotTakeContext = createContext(null);

const SHOT_TAKE_SESSION_STORAGE_KEY = 'currentShotTake';

export function ShotTakeProvider({ children }) {
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
      sessionStorage.setItem(SHOT_TAKE_SESSION_STORAGE_KEY, JSON.stringify(state));
    }
  }, []);

  function updateState(state) {
    sessionStorage.setItem(SHOT_TAKE_SESSION_STORAGE_KEY, JSON.stringify(state));
    setState(state);
  }

  const api = {
    state,
    setState: updateState,
  };
  return (
    <ShotTakeContext.Provider value={api}>
      {children}
    </ShotTakeContext.Provider>
  );
}

export function useShotTake() {
  let result = useContext(ShotTakeContext);
  if (!result) {
    return result;
  }
  return result;
}
