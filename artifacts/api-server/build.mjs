import * as esbuild from 'esbuild';
import { glob } from 'glob';

const entryPoints = await glob('src/**/*.ts', { cwd: process.cwd() });

await esbuild.build({
  entryPoints,
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: 'dist',
  external: ['pg'],
  sourcemap: true,
  logLevel: 'info',
});
