import { useMenuContext } from '@ariakit/react';

export function useForceRefreshOnMenuOpen() {
  const menu = useMenuContext();
  return menu?.useState('open');
}
