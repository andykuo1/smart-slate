import { useClapperSettingsStore } from './ClapperSettingsStore';

export function useClapperSettingsBlackboard() {
  return useClapperSettingsStore((ctx) => ctx.blackboard);
}
