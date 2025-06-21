import path from 'node:path';
import fs from 'fs-extra';
import { build, type BuildResult, type BuildOptions } from 'esbuild';
import { exec } from 'child_process';
import deepmerge from 'deepmerge';
import { promisify } from 'util';
import chalk from 'chalk';
import { loadPackageConfig } from './loadPackageConfig';
import { injectStyleImport } from './injectStyleImport';
import { getPackagePath, logger, step } from '../lib';
import cssModulesPlugin from 'esbuild-css-modules-plugin';

type ExecResult = { stdout: string; stderr: string };

const execAsync = promisify(exec);

export async function buildPackage(packageName: string): Promise<void> {
  const pckDir = await getPackagePath(packageName);
  const nameLabel = chalk.cyan(`rendou/${packageName}`);

  if (!pckDir) {
    throw new Error(`Package ${nameLabel} not found`);
  }

  const srcDir = path.join(pckDir, 'src');
  const distDir = path.join(pckDir, 'dist');
  const startTime = Date.now();

  await step<void>(`Cleaned ${nameLabel} dist`, () => fs.emptyDir(distDir));

  await step<ExecResult>(`Generated TS declarations for ${nameLabel}`, () =>
    execAsync(`npx tsc --project ${path.join(pckDir, 'tsconfig.json')}`),
  );

  const pkg = await fs.readJson(path.join(pckDir, 'package.json'));
  const baseOptions: BuildOptions = {
    absWorkingDir: srcDir,
    bundle: true,
    sourcemap: true,
    minify: true,
    format: 'esm',
    entryPoints: [path.join(srcDir, 'index.ts')],
    outdir: distDir,
    loader: { '.css': 'css' },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      'path',
      'fs/promises',
      'node:path',
      'node:fs/promises',
      'react',
      'react-dom',
      'react/jsx-runtime',
    ],
    plugins: [
      cssModulesPlugin({
        localsConvention: 'camelCase',
        inject: false,
      }),
    ],
  };

  const configPath = path.join(pckDir, 'build.config.ts');
  let packageOpt: BuildOptions = {};
  if (await fs.pathExists(configPath)) {
    packageOpt = await loadPackageConfig(configPath);
  }
  const opt = deepmerge<BuildOptions>(baseOptions, packageOpt, {
    arrayMerge: (a, b) => [...new Set([...a, ...b])],
  });

  await step<BuildResult>(`Built ${nameLabel}`, () => build(opt));

  await step<void>(`Injected CSS import into ${nameLabel}`, () =>
    injectStyleImport(distDir, 'index.css'),
  );

  const endTime = Date.now();
  const buildTime = ((endTime - startTime) / 1000).toFixed(2);
  logger.success(`Built ${nameLabel} in ${chalk.green(`${buildTime}s`)}`);
}
