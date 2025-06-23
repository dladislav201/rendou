import fs from 'node:fs/promises';
import { posix } from 'node:path';
import { fileWalker } from './fileWalker';
import { MDX_PATTERN } from '../constants';

export async function getAllSlugs(
  contentDir: string = 'content',
): Promise<string[]> {
  await fs.access(contentDir);

  const promise = fileWalker(contentDir).then((paths) =>
    paths.map((p) => posix.relative(contentDir, p).replace(MDX_PATTERN, '')),
  );

  return promise;
}
