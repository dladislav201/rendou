# @rendou/core

Zero-config Markdown-to-React compiler for React and Next.js apps.

- **Frontmatter extraction**: parse YAML metadata out of your `.md` files.
- **GFM & HTML**: support GitHub-flavored Markdown and inline HTML.
- **Shiki syntax highlighting**: beautiful, themeable code blocks.
- **Robust error handling**: `MarkdownError` for missing files or parse failures.

## Installation

```bash
# npm
npm install @rendou/core

# Yarn
yarn add @rendou/core

# pnpm
pnpm add @rendou/core
```

## Quick Start

Below is a minimal example showing how to use `@rendou/core` in a Next.js App Router dynamic route `[...slug]` to compile and render Markdown files on the fly. This page component will match any nested path, e.g. `/blog/artists/steve-jobs` → `slug = ['blog','artists', 'steve-jobs']`. We handle missing files with `notFound()` and demonstrate how to access frontmatter metadata.

```ts
// app/[...slug]/page.tsx

import { compileMarkdownFile, MarkdownError } from '@rendou/core';

async function demo({ params }: { params: Promise<{ slug: string[] }> }) {
  try {
    const { slug } = await params;
    const { frontmatter, content } = await compileMarkdownFile(
      slug,
      'content', // Optional: defaults to 'content' if omitted
    );
    return (
      {/* Example: display a title from frontmatter */}
      {frontmatter.title && <h1>{frontmatter.title}</h1>}

      {/* Render the transformed Markdown content */}
      <article>{content}</article>
    )
  } catch (err) {
    if (err instanceof MarkdownError && err.code === 'ENOENT') {
      notFound();
    } else {
      throw err;
    }
  }
}
```

## API

```ts
async function compileMarkdownFile<
  FM extends Record<string, unknown> = Record<string, unknown>,
>(slug: string[], contentDir: string = 'content'): Promise<CompileResult<FM>>;
```

#### Parameters

- `slug: string[]` — path segments (no file extension).
- `contentDir?: string` — directory where .md files live (defaults to "content").

#### Returns

```ts
interface CompileResult<FM> {
  frontmatter: FM;
  content: ReactNode;
}
```

#### Errors

- `MarkdownError('ENOENT', …)` — file not found.
- `MarkdownError('PARSE', …)` — parse or transform failure.

### MarkdownError

```ts
export class MarkdownError extends Error {
  constructor(
    public code: 'ENOENT' | 'PARSE',
    message?: string,
  ) {
    super(message);
    this.name = 'MarkdownError';
  }
}
```

## Project Structure

```bash
packages/core/
├─ src/
│  ├─ compile.ts # main implementation
│  ├─ index.ts # re-exports
│  └─ shared/
│     ├─ error.ts # MarkdownError
│     ├─ types.ts # CompileResult
│     ├─ lib
│     │  └─ isErrnoWithCode.ts
│     └─ plugins/
│        ├─ highlighter.ts
│        └─ remarkShiki.ts
├─ build.config.ts # (optional) exceptional esbuild config overrides
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Plugins

Syntax highlighting via `remarkShiki` with `slack-dark` theme in `shared/plugins/remarkShiki.ts`.

## License

This project is licensed under the MIT License.

## Contact

**Vladyslav Dobrodii**

- [dobrodii.vlad200@gmail.com](mailto:dobrodii.vlad200@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/vladyslav-dobrodii-20384a233/)
- [GitHub](https://github.com/dladislav201/)
