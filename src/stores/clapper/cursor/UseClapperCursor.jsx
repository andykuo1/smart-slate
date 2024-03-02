import { useClapperCursorStore } from './ClapperCursorStore';

export function useClapperCursorClapperId() {
  return useClapperCursorStore((ctx) => ctx.clapperId ?? '');
}

export function useClapperCursorSlateId() {
  return useClapperCursorStore((ctx) => ctx.slateId ?? '');
}

export function useClapperCursorClapId() {
  return useClapperCursorStore((ctx) => ctx.clapId ?? '');
}

export function useClapperCursorSceneNumber() {
  return useClapperCursorStore((ctx) => ctx.sceneNumber ?? 0);
}

export function useClapperCursorShotNumber() {
  return useClapperCursorStore((ctx) => ctx.shotNumber ?? 0);
}

export function useClapperCursorRollName() {
  return useClapperCursorStore((ctx) => ctx.rollName ?? '');
}
