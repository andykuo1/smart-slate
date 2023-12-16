import { defineConfig } from 'cypress';
import vitePreprocessor from 'cypress-vite';
import fs from 'fs';
import path from 'path';
import url from 'url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  e2e: {
    // NOTE: Port is dependent on the hosted dev server
    baseUrl: 'http://localhost:8080/smart-slate/',
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
