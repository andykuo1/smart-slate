import { produce } from 'immer';

/**
 * @template Store, Args
 * @param {import('zustand').StateCreator} set
 * @param {(store: Store, ...args: Args) => void} applier
 * @returns {(...args: Args) => void}
 */
export function zi(set, applier) {
  return (...args) => set(produce((draft) => applier(draft, ...args)));
}
