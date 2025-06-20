import path from 'node:path';
import fs from 'fs-extra';
import { build, type BuildOptions } from 'esbuild';
import chalk from 'chalk';
import deepmerge from 'deepmerge';
import { generateTypeDeclaration } from './generateTypeDeclaration';
import { loadPackageConfig } from './loadPackageConfig';
import { injectStyleImport } from './injectStyleImport';
import { getPackagePath, logger } from '../lib';

export async function buildPackage(packageName: string): Promise<boolean> {
  const packagePath = getPackagePath(packageName);
  const formattedPackageName = chalk.cyan(`rendou/${packageName}`);

  if (!packagePath) {
    logger.error(`Package ${formattedPackageName} does not exist`);
    return false;
  }

  const srcDir = path.join(packagePath, 'src');
  const distDir = path.join(packagePath, 'dist');

  try {
    const startTime = Date.now();

    logger.log(`Cleaning ${formattedPackageName} dist directory...`);
    await fs.emptyDir(distDir);

    logger.log(`Generating ${formattedPackageName} TypeScript declarations...`);
    await generateTypeDeclaration(packagePath);

    const pkg = fs.readJsonSync(path.join(packagePath, 'package.json'));
    const baseOptions: BuildOptions = {
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
    };
    const configPath = path.join(packagePath, 'build.config.ts');
    const packageOpt = configPath ? await loadPackageConfig(configPath) : {};
    const opt: BuildOptions = deepmerge(baseOptions, packageOpt, {
      arrayMerge: (dest, src) => [...new Set([...dest, ...src])],
    });

    logger.log(`Building package ${formattedPackageName}`);
    await build(opt);

    logger.log(
      `Injecting style import into ${formattedPackageName} dist/index.js`,
    );
    await injectStyleImport(distDir, 'index.css');

    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(2);
    logger.success(
      `Built ${formattedPackageName} in ${chalk.green(`${buildTime}s`)}`,
    );

    return true;
  } catch (err) {
    logger.error(`Failed to build package ${formattedPackageName} with error:`);
    logger.error(err);
    return false;
  }
}
