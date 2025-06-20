import { type ExecException } from 'child_process';
import { logger } from './logger';

export function logExecError(err: unknown) {
  if (err instanceof Error) {
    logger.error(`Message: ${err.message}`);
    logger.error(`Stack:\n${err.stack}`);
  } else if (
    typeof err === 'object' &&
    err !== null &&
    ('stdout' in err || 'stderr' in err)
  ) {
    const e = err as ExecException & { stdout?: string; stderr?: string };
    logger.error(e.stdout ?? e.stderr ?? 'No output captured');
  } else {
    logger.error(`Unknown error shape: ${JSON.stringify(err, null, 2)}`);
  }
}
