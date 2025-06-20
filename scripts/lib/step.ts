import { logger } from './logger';

export async function step<T>(
  description: string,
  fn: () => Promise<T>,
): Promise<T> {
  const result = await fn();
  logger.log(`${description}`);
  return result;
}
