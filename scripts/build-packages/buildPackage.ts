import path from 'node:path';
import fs from 'fs-extra';
import { exec } from 'child_process';
import { promisify } from 'util';
import chalk from 'chalk';
import { compile } from './compile';
import { createRollupConfig } from './createRollupConfig';
import { getPackagePath, relocateCssAndInject, logger } from '../lib';
import { ExecException } from 'child_process';

const execAsync = promisify(exec);

export async function buildPackage(packageName: string): Promise<boolean> {
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
    ).catch((err: unknown) => {
      if (err instanceof Error) {
        logger.error(`Message: ${err.message}`);
        logger.error(`Stack:\n${err.stack}`);
      } else if (
        typeof err === 'object' &&
        err !== null &&
        ('stdout' in err || 'stderr' in err)
      ) {
        const execErr = err as ExecException & {
          stdout?: string;
          stderr?: string;
        };
        logger.error(execErr.stdout ?? execErr.stderr ?? 'No output captured');
      } else {
        logger.error(`Unknown error shape: ${JSON.stringify(err, null, 2)}`);
      }
    });

    logger.log(`Compiling ${formattedPackageName} package...`);
    try {
      const config = createRollupConfig(packagePath);
      await compile(config);
    } catch (rollupError: unknown) {
      logger.error(`Rollup compilation failed for ${formattedPackageName}`);
      if (rollupError instanceof Error) {
        logger.error(`Error message: ${rollupError.message}`);
        logger.error(`Stack trace:\n${rollupError.stack}`);
      } else {
        logger.error(
          `Unknown error type: ${JSON.stringify(rollupError, null, 2)}`,
        );
      }
      return false;
    }

    await relocateCssAndInject(distDir);

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
