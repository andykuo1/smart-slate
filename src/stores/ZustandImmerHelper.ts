import { produce } from 'immer';

type Set = import('zustand').StoreApi<any>['setState'];

export function zi<Store, Args extends Array<any>>(
  set: Set,
  applier: (store: Store, ...args: Args) => void,
) {
  return (...args: Args) =>
    set(produce((draft) => applier(draft as Store, ...(args as Args))));
}
