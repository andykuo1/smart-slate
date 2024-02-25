import { useState } from 'react';
import { createContext } from 'react';

const DraggableContext = createContext(/** @type {Draggable|null} */ (null));

/** @typedef {ReturnType<createDraggableState>} DraggableState */
/** @typedef {ReturnType<createStore>} Store */
/** @typedef {string} ContainerId */
/** @typedef {string} ElementId */

function createStore() {
  return {
    state: createDraggableState(),
    dispatch: {},
  };
}

function createDraggableState() {
  return {
    containerId: '',
    targetId: '',
    overContainerId: '',
    overTargetId: '',
    dragStart: [0, 0],
    dragMove: [0, 0],
    dragStop: [0, 0],
    dragging: false,
    /** @type {() => void} */
    completeCallback: null,
  };
}

export function DraggableProvider({ children }) {
  let [store, setStore] = useState(createStore());
  let api = {
    store,
    setStore,
  };
  return (
    <DraggableContext.Provider value={api}>
      {children}
    </DraggableContext.Provider>
  );
}

export function useDraggable(containerId, targetId) {
  const elementProps = {};
  const handleProps = {};
  return {
    elementProps,
    handleProps,
  };
}
