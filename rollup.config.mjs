import { createRequire } from 'module';
import path from 'path';
import copy from 'rollup-plugin-copy';
import scss from 'rollup-plugin-scss';
import jscc from 'rollup-plugin-jscc';

// CommonJS helpers (foundry-path.js is CJS; sass/fs are node/CJS).
const require = createRequire(import.meta.url);
const fs = require('fs');
const foundryPath = require('./foundry-path.js');
const sass = require('sass');

const manifest = JSON.parse(fs.readFileSync('./system.json'));
const systemPath = foundryPath.systemPath(manifest.id);
const isProd = process.env.NODE_ENV === 'production';

// The SCSS plugin writes this file on every build; watching it would create an
// infinite rebuild loop, so it must be excluded from the static watch set.
const SCSS_OUTPUT = path.resolve('static/css/edrpg.css');

console.log('Bundling to ' + systemPath);

// Recursively list files so Rollup can watch static assets (templates, lang,
// SCSS partials, …). Editing any of them triggers a rebuild → the copy plugin
// re-syncs them to the Foundry system dir, and SCSS partials recompile.
function collectFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectFiles(full));
    else out.push(full);
  }
  return out;
}

// Replaces the abandoned rollup-plugin-copy-watch (which crashed the watcher on
// Node 20 with `ENOENT unlink`). In dev, add static assets to Rollup's watch set.
const watchStatic = {
  name: 'watch-static-assets',
  buildStart() {
    if (isProd) return;
    for (const file of collectFiles('static')) {
      const abs = path.resolve(file);
      if (abs === SCSS_OUTPUT) continue; // never watch the SCSS plugin's own output
      this.addWatchFile(abs);
    }
    this.addWatchFile(path.resolve('template.json'));
    this.addWatchFile(path.resolve('system.json'));
  },
};

export default {
  input: [`${manifest.id}.js`],
  output: {
    file: path.join(systemPath, `${manifest.id}.js`),
    format: 'es',
  },
  watch: {
    clearScreen: true,
  },
  plugins: [
    jscc({
      values: { _ENV: process.env.NODE_ENV },
    }),
    scss({
      output: `./static/css/edrpg.css`,
      // In watch mode an SCSS error thrown by this plugin would otherwise bubble
      // up; only fail the build hard for production releases.
      failOnError: isProd,
      runtime: sass,
      quietDeps: false,
    }),
    watchStatic,
    copy({
      // `writeBundle` runs after the bundle (and SCSS output) is written, so the
      // copied static/css is never stale. Copies on every (re)build.
      hook: 'writeBundle',
      copyOnce: false,
      targets: [
        { src: './template.json', dest: systemPath },
        { src: './system.json', dest: systemPath },
        { src: './static/*', dest: systemPath },
      ],
    }),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'EVAL') return;
    warn(warning);
  },
};
