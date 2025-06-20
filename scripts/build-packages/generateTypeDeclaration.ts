import path from 'node:path';
import { promisify } from 'util';
import { exec, type ExecException } from 'child_process';
import { logExecError } from '../lib';

const execAsync = promisify(exec);

export async function generateTypeDeclaration(
  packagePath: string,
): Promise<void> {
  try {
    await execAsync(
      `npx tsc --project ${path.join(packagePath, 'tsconfig.json')}`,
    );
  } catch (err: unknown) {
    logExecError(err);
    throw err;
  }
}
