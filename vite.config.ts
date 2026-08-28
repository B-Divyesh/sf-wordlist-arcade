import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const APP_VERSION = '20260828-polish1';

function pwaServiceWorker() {
  return {
    name: 'wordlist-arcade-service-worker',
    closeBundle() {
      const output = resolve(__dirname, 'dist');
      const manifest = JSON.parse(readFileSync(resolve(output, '.vite/manifest.json'), 'utf8')) as Record<string, {
        file?: string;
        css?: string[];
        assets?: string[];
      }>;
      const builtAssets = new Set<string>();
      Object.values(manifest).forEach(entry => {
        if (entry.file) builtAssets.add(`/${entry.file}`);
        entry.css?.forEach(file => builtAssets.add(`/${file}`));
        entry.assets?.forEach(file => builtAssets.add(`/${file}`));
      });
      const precache = [
        '/',
        `/?v=${APP_VERSION}`,
        '/demo',
        '/?demo=1',
        '/manifest.webmanifest',
        '/favicon.svg',
        '/icons/icon-192.png',
        '/icons/icon-512.png',
        '/icons/icon-maskable-512.png',
        '/offline.html',
        '/privacy/',
        '/terms/',
        ...builtAssets
      ];
      const template = readFileSync(resolve(__dirname, 'src/sw-template.js'), 'utf8');
      writeFileSync(resolve(output, 'sw.js'), template
        .replace('__VERSION__', APP_VERSION)
        .replace('__PRECACHE__', JSON.stringify(precache)));
    }
  };
}

export default defineConfig({
  plugins: [pwaServiceWorker()],
  build: {
    target: 'es2022',
    manifest: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        privacy: resolve(__dirname, 'privacy/index.html'),
        terms: resolve(__dirname, 'terms/index.html')
      }
    }
  }
});
