import path from 'path';
import fs from 'fs-extra';

export const packageDir = path.resolve(process.cwd(), 'packages', 'rendou');

export function getPackagePath(packageName: string): string | null {
  const packagePath = path.join(packageDir, packageName);
  return fs.existsSync(packagePath) ? packagePath : null;
}
