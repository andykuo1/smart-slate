// @ts-expect-error Importing virtual module vite-pwa
import { registerSW } from 'virtual:pwa-register';

const intervalMS = 60 * 60 * 1000;

const updateSW = registerSW({
  onNeedRefresh() {
    if (window.confirm('New version available. Update app?')) {
      updateSW();
    }
  },
  onOfflineReady() {
    // TODO: App is ready offline!
  },
  /**
   * @param {string} swUrl
   * @param {*} r
   */
  onRegisteredSW(swUrl, r) {
    r &&
      setInterval(async () => {
        if (!(!r.installing && navigator)) return;

        if ('connection' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await r.update();
      }, intervalMS);
  },
});
