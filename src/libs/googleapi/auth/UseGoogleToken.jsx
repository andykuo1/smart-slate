import { useUserStore } from '@/stores/user';

export function useGoogleToken() {
  return useUserStore((ctx) => ctx.googleContext.token);
}
