import { type ExecException } from 'child_process';

export function isExecError(
  e: unknown,
): e is ExecException & { stdout?: string; stderr?: string } {
  return typeof e === 'object' && e !== null && 'stdout' in e && 'stderr' in e;
}
