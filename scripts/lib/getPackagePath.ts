import path from 'path';
import fs from 'fs-extra';

export const packageDir = path.resolve(process.cwd(), 'packages');

export async function getPackagePath(
  packageName: string,
): Promise<string | null> {
  const packagePath = path.join(packageDir, packageName);
  return (await fs.pathExists(packagePath)) ? packagePath : null;
}
