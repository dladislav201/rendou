import fs from 'node:fs/promises';
import { join } from 'node:path';
import { MDX_PATTERN } from '../constants';

export async function fileWalker(root: string): Promise<string[]> {
  const dirents = await fs.readdir(root, { withFileTypes: true });

  const files: string[] = [];
  await Promise.all(
    dirents.map(async (d) => {
      const p = join(root, d.name);

      if (d.isDirectory()) {
        files.push(...(await fileWalker(p)));
      } else if (MDX_PATTERN.test(d.name)) {
        files.push(p);
      }
    }),
  );

  return files;
}
