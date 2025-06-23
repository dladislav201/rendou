import type { BuildOptions } from 'esbuild';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

const config: Partial<BuildOptions> = {
  platform: 'browser',
  target: ['es2020'],
  splitting: false,
  plugins: [
    cssModulesPlugin({
      localsConvention: 'camelCase',
      inject: false,
    }),
  ],
};

export default config;
