import { logger } from '../lib';
import { buildAllPackages } from './build';

buildAllPackages().catch((error) => {
  logger.error('Build process failed');
  console.error(error);
  process.exit(1);
});
