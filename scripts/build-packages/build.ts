import path from 'node:path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import { compile } from './compile';
import { createPackageConfig } from './createPackageConfig';
import { getPackagePath, logger } from '../lib';

const execAsync = promisify(exec);
const BUILD_ORDER = ['core', 'next'];

async function buildPackage(packageName: string) {
  const packagePath = getPackagePath(packageName);
  const formattedPackageName = chalk.cyan(`rendou/${packageName}`);

  if (!packagePath) {
    logger.error(`Package ${formattedPackageName} does not exist`);
    return false;
  }

  logger.log(`Building package ${formattedPackageName}`);

  try {
    const startTime = Date.now();

    const distDir = path.join(packagePath, 'dist');
    logger.log(`Cleaning ${formattedPackageName} dist directory...`);
    await fs.emptyDir(distDir);

    logger.log(`Generating ${formattedPackageName} TypeScript declarations...`);
    await execAsync(
      `npx tsc --project ${path.join(packagePath, 'tsconfig.json')}`,
    ).catch((err) => {
      logger.error(
        `TypeScript Error:\n${err.stdout || err.stderr || err.message}`,
      );
      throw err;
    });

    logger.log(`Compiling ${formattedPackageName} package...`);
    try {
      const config = createPackageConfig(packagePath);
      await compile(config);
    } catch (rollupError) {
      logger.error(`Rollup compilation failed for ${formattedPackageName}`);
      logger.error(`Rollup Error Details: \n ${rollupError}`);
      return false;
    }

    const cjsStylePath = path.join(packagePath, 'dist/cjs/styles.css');
    const esmStylePath = path.join(packagePath, 'dist/esm/styles.css');
    const targetStylePath = path.join(packagePath, 'dist/styles.css');

    if (fs.existsSync(cjsStylePath)) {
      await fs.copy(cjsStylePath, targetStylePath);
      await fs.remove(cjsStylePath);
    }
    if (fs.existsSync(esmStylePath)) {
      await fs.copy(esmStylePath, targetStylePath);
      await fs.remove(esmStylePath);
    }

    const endTime = Date.now();
    const buildTime = ((endTime - startTime) / 1000).toFixed(2);
    logger.success(
      `Package ${formattedPackageName} built in ${chalk.green(`${buildTime}s`)}`,
    );

    return true;
  } catch (error) {
    logger.error(`Failed to build package ${formattedPackageName} with error:`);
    logger.error(error);
    return false;
  }
}

export async function buildAllPackages() {
  logger.log('Building all packages...');

  let hasErrors = false;

  for (const pkg of BUILD_ORDER) {
    const success = await buildPackage(pkg);
    if (!success) {
      hasErrors = true;
    }
  }

  if (hasErrors) {
    logger.error('Some packages failed to build');
    process.exit(1);
  } else {
    logger.success(chalk.green('All packages built successfully!'));
  }
}
