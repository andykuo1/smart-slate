import { produce } from 'immer';

type Set = import('zustand').StoreApi<any>['setState'];
type Get = import('zustand').StoreApi<any>['getState'];

export function zi<Store, Args extends Array<any>>(
  set: Set,
  applier: (store: Store, ...args: Args) => void,
) {
  return (...args: Args) =>
    set(produce((draft) => applier(draft as Store, ...(args as Args))));
}

export function ziget<Store, ReturnType, Args extends Array<any>>(
  get: Get,
  applier: (store: Store, ...args: Args) => ReturnType,
) {
  return (...args: Args) =>
    applier(get(), ...(args as Args)) as Readonly<ReturnType>;
}
