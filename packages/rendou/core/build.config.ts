import type { BuildOptions } from 'esbuild';

const config: Partial<BuildOptions> = {
  platform: 'node',
  target: ['node18'],
  splitting: true,
};

export default config;
