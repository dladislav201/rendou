import path from 'node:path';
import fs from 'fs-extra';

export async function injectStyleImport(
  distDir: string,
  cssFile = 'index.css',
): Promise<void> {
  const rootCss = path.join(distDir, cssFile);
  const entryPath = path.join(distDir, 'index.js');

  if (!(await fs.pathExists(rootCss)) || !(await fs.pathExists(entryPath)))
    return;

  const relToRootCss = path
    .relative(path.dirname(entryPath), rootCss)
    .replace(/\\/g, '/');

  const importLine = `import './${relToRootCss}';`;
  const original = await fs.readFile(entryPath, 'utf8');
  if (original.includes(importLine)) return;

  const updated = `${importLine}\n${original}`;
  await fs.writeFile(entryPath, updated, 'utf8');
}
