import react from '@vitejs/plugin-react-swc';

import basicSSL from '@vitejs/plugin-basic-ssl';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import PackageJSON from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${PackageJSON.name}/`,
  define: {
    __CONFIGTIME__: JSON.stringify(Date.now()),
  },
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
    }),
    tsconfigPaths(),
    basicSSL(),
    VitePWA({
      /*
      // NOTE: Use this to nuke everything :)
      selfDestroying: true,
      */
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      injectRegister: 'auto',
      registerType: 'autoUpdate',
      devOptions: {
        /* NOTE: Enable this to test PWA features. */
        enabled: false,
      },
      manifest: {
        name: 'EagleStudio SmartSlate',
        short_name: 'SmartSlate',
        description: 'A shot list made with ❤️',
        theme_color: '#ffffff',
        screenshots: [
          {
            src: '/smart-slate/demo1.png',
            sizes: '1098x942',
            type: 'image/png',
            form_factor: 'wide',
            label: 'My Movie shot list',
          },
          {
            src: '/smart-slate/demo2.png',
            sizes: '518x636',
            type: 'image/png',
            label: 'Recording a new take',
          },
        ],
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
});
