import { execFileSync } from 'node:child_process';

const node20 = ['--yes', 'node@20.19.0'];
const runWithNode20 = (script, args = []) => execFileSync('npx', [...node20, script, ...args], {
  cwd: process.cwd(),
  stdio: 'inherit'
});

runWithNode20('node_modules/typescript/bin/tsc', ['--noEmit']);
runWithNode20('node_modules/vite/bin/vite.js', ['build']);
