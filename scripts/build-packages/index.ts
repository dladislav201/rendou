import { logger } from '../lib';
import { buildAllPackages } from './buildAllPackages';

buildAllPackages().catch((error) => {
  logger.error('Build process failed');
  console.error(error);
  process.exit(1);
});
