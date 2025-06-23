import path from 'path';
import fs from 'fs/promises';
import type { ReactNode } from 'react';
import { unified } from 'unified';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import type { CompileResult } from './shared/types';
import { remarkShiki } from './shared/plugins';
import { MarkdownError } from './shared/error';
import rehypeReact from 'rehype-react';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import { isErrnoWithCode } from './shared/lib/isErrnoWithCode';
import remarkFrontmatter from 'remark-frontmatter';
import { vfileMatterPlugin } from './shared/plugins';
import remarkRehype from 'remark-rehype';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';

export async function compileMarkdownFile<
  FM extends Record<string, unknown> = Record<string, unknown>,
>(slug: string[], contentDir: string = 'content'): Promise<CompileResult<FM>> {
  const fp = path.join(process.cwd(), contentDir, ...slug) + '.md';

  let raw: string;
  try {
    raw = await fs.readFile(fp, 'utf8');
  } catch (err) {
    if (isErrnoWithCode(err, 'ENOENT')) {
      throw new MarkdownError(
        'ENOENT',
        `[rendou] Markdown file ${fp} not found`,
      );
    }
    throw err;
  }

  let vfile;
  try {
    const processor = unified()
      .use(remarkParse)
      .use(remarkShiki)
      .use(remarkGfm)
      .use(remarkFrontmatter, ['yaml'])
      .use(vfileMatterPlugin)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeRaw)
      .use(rehypeSanitize, {
        ...defaultSchema,
        attributes: {
          ...defaultSchema.attributes,
          span: [...(defaultSchema.attributes?.span ?? []), ['style']],
          code: [...(defaultSchema.attributes?.code ?? []), ['className']],
        },
      })
      .use(rehypeReact, {
        jsx,
        jsxs,
        Fragment,
      });

    vfile = await processor.process(raw);
  } catch (err) {
    throw new MarkdownError(
      'PARSE',
      `[rendou] Failed to parse/transform markdown ${fp}: ${(err as Error).message}`,
    );
  }

  const frontmatter = vfile?.data.matter as FM;
  const content = vfile?.result as ReactNode;

  return { frontmatter, content };
}
