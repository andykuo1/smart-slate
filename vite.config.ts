import react from '@vitejs/plugin-react-swc';

import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

import PackageJSON from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  base: `/${PackageJSON.name}/`,
  plugins: [
    react(),
    svgr({
      include: '**/*.svg',
    }),
    tsconfigPaths(),
  ],
});
