import type { BuildOptions } from 'esbuild';

const config: Partial<BuildOptions> = {
  platform: 'browser',
  target: ['es2020'],
  splitting: false,
};

export default config;
