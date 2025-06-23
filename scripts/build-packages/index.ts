import chalk from 'chalk';
import { buildPackage } from './buildPackage';
import { logger } from '../lib';

const BUILD_ORDER = ['core', 'next'];

async function main() {
  try {
    const startTime = Date.now();
    logger.log('Build initiated');

    for (const pkg of BUILD_ORDER) {
      await buildPackage(pkg);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(2);
    logger.success(
      `All packages built successfully in ${chalk.green(`${totalTime}s`)}`,
    );
  } catch (err: unknown) {
    logger.error('Build failed with error: ', err);
    process.exit(1);
  }
}

main();
