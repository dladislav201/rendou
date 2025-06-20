import chalk from 'chalk';
import { buildPackage } from './buildPackage';
import { logger } from '../lib';

const BUILD_ORDER = ['core', 'next'];

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
