import { useShallow } from 'zustand/react/shallow';

import { useToolboxStore } from './UseToolboxStore';

export function useScannerFileKeys() {
  return useToolboxStore(useShallow((ctx) => Object.keys(ctx.scanner.files)));
}

export function useScannerFileRenameKeys() {
  return useToolboxStore(useShallow((ctx) => Object.keys(ctx.scanner.renames)));
}

export function useScannerFileAnalysisKeys() {
  return useToolboxStore(
    useShallow((ctx) => Object.keys(ctx.scanner.analysis)),
  );
}

/**
 * @param {import('./ToolboxStore').FileKey} fileKey
 */
export function useScannerFileObject(fileKey) {
  return useToolboxStore((ctx) => ctx.scanner.files[fileKey]);
}

/**
 * @param {import('./ToolboxStore').FileKey} fileKey
 */
export function useScannerFileAnalysis(fileKey) {
  return useToolboxStore((ctx) => ctx.scanner.analysis[fileKey]);
}

/**
 * @param {import('./ToolboxStore').FileKey} fileKey
 */
export function useScannerFileRenameValue(fileKey) {
  return useToolboxStore((ctx) => ctx.scanner.renames[fileKey]);
}

export function useScannerFileObjectMap() {
  return useToolboxStore((ctx) => ctx.scanner.files);
}

export function useScannerFileRenameMap() {
  return useToolboxStore((ctx) => ctx.scanner.renames);
}
