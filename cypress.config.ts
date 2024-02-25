import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
import fs from 'fs';
import path from 'path';
import url from 'url';

import PackageJSON from './package.json' assert { type: 'json' };

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const PACKAGE_NAME = PackageJSON.name.split('/').at(-1);

export default defineConfig({
  e2e: {
    // NOTE: Port is dependent on the hosted dev server
    baseUrl: `https://localhost:8080/${PACKAGE_NAME}/`,
    // NOTE: By default it's 1 min, which is a bit long for our use case.
    pageLoadTimeout: 10000,
    setupNodeEvents(on, config) {
      on(
        'file:preprocessor',
        vitePreprocessor({
          configFile: path.resolve(__dirname, './vite.config.ts'),
          mode: 'development',
        }),
      );
      on('task', {
        findDownloadedFile({ path: dir = config.downloadsFolder, fileName }) {
          if (!fs.existsSync(dir)) return null;
          return fs
            .readdirSync(dir)
            .filter(
              (file) =>
                file.includes(fileName) && isChromeDownloadedFileReady(file),
            );
        },
      });
    },
  },
});

function isChromeDownloadedFileReady(fileName) {
  return !fileName.endsWith('.crdownload');
}
