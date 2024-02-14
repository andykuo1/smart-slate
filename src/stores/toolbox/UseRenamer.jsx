import { useShallow } from 'zustand/react/shallow';

import { useToolboxStore } from './UseToolboxStore';

export function useRenamerFileKeys() {
  return useToolboxStore(useShallow((ctx) => Object.keys(ctx.renamer.files)));
}

export function useRenamerFileRenameKeys() {
  return useToolboxStore(useShallow((ctx) => Object.keys(ctx.renamer.renames)));
}

/**
 * @param {import('./ToolboxStore').FileKey} fileKey
 */
export function useRenamerFileObject(fileKey) {
  return useToolboxStore((ctx) => ctx.renamer.files[fileKey]);
}

/**
 * @param {import('./ToolboxStore').FileKey} fileKey
 */
export function useRenamerFileRenameValue(fileKey) {
  return useToolboxStore((ctx) => ctx.renamer.renames[fileKey]);
}
