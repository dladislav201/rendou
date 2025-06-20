import path from 'path';
import fs from 'fs-extra';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import postcss from 'rollup-plugin-postcss';
import autoprefixer from 'autoprefixer';
import esbuild from 'rollup-plugin-esbuild';
import cssnano from 'cssnano';
import { RollupOptions } from 'rollup';

export function createRollupConfig(packagePath: string): RollupOptions {
  const pkg = fs.readJsonSync(path.join(packagePath, 'package.json'));
  const distDir = path.join(packagePath, 'dist');

  const plugins = [
    nodeResolve({
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    esbuild({
      tsconfig: path.posix.resolve('tsconfig.json'),
    }),
    commonjs(),
    postcss({
      modules: true,
      extract: 'styles.css',
      plugins: [autoprefixer(), cssnano()],
    }),
    terser(),
  ];

  return {
    input: path.join(packagePath, 'src/index.ts'),
    output: [
      {
        dir: path.join(distDir, 'cjs'),
        format: 'cjs',
        entryFileNames: '[name].cjs',
        preserveModules: true,
        preserveModulesRoot: path.join(packagePath, 'src'),
        exports: 'named',
        sourcemap: true,
      },
      {
        dir: path.join(distDir, 'esm'),
        format: 'esm',
        entryFileNames: '[name].mjs',
        preserveModules: true,
        preserveModulesRoot: path.join(packagePath, 'src'),
        sourcemap: true,
      },
    ],
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'react',
      'react-dom',
      'react/jsx-runtime',
      'next',
      'next/navigation',
    ],
    onwarn(warning, warn) {
      if (warning.code === 'EMPTY_BUNDLE') return;
      warn(warning);
    },
    plugins,
  };
}
