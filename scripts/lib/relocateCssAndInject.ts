import path from 'node:path';
import fs from 'fs-extra';

export async function relocateCssAndInject(
  distDir: string,
  cssFile = 'styles.css',
): Promise<void> {
  const rootCss = path.join(distDir, cssFile);
  const outputs: Array<['esm' | 'cjs', string]> = [
    ['esm', 'index.mjs'],
    ['cjs', 'index.cjs'],
  ];

  await Promise.all(
    outputs.map(async ([sub]) => {
      const src = path.join(distDir, sub, cssFile);
      if (await fs.pathExists(src)) {
        await fs.move(src, rootCss, { overwrite: true });
      }
    }),
  );

  if (!(await fs.pathExists(rootCss))) return;

  const strict = '"use strict";';
  const importJs = (rel: string, isCjs: boolean) =>
    isCjs ? `require('${rel}');` : `import '${rel}';`;

  await Promise.all(
    outputs.map(async ([sub, entryName]) => {
      const entryPath = path.join(distDir, sub, entryName);
      if (!(await fs.pathExists(entryPath))) return;

      const relToRootCss = path
        .relative(path.dirname(entryPath), rootCss)
        .replace(/\\/g, '/');

      const stmt = importJs(`${relToRootCss}`, sub === 'cjs');
      let code = await fs.readFile(entryPath, 'utf8');

      if (code.startsWith(strict)) {
        code = code.replace(/^"use strict";\s*/, `${strict}\n${stmt}\n`);
      } else if (!code.startsWith(stmt)) {
        code = `${stmt}\n${code}`;
      }

      await fs.writeFile(entryPath, code, 'utf8');
    }),
  );
}
