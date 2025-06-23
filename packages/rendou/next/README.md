# rendou

> ⚠️ **This library requires Next.js App Router** and is **not compatible** with the Pages Router.

Quick-start package to compile Markdown into React components and generate Next.js App Router pages with zero config (built on top of `@rendou/core`). Provides a `CreateMarkdownPage()` factory that handles:

- Slug-based routing
- Markdown compilation
- Shiki syntax highlighting
- Built in CSS theme
- `generateStaticParams` for SSG

## Installation

```bash
# npm
npm install rendou

# Yarn
yarn add rendou

# pnpm
pnpm add rendou
```

> **Note:** Installing **rendou** will automatically install **@rendou/core** as its dependency.

## Quick Start

Create a dynamic route under app/[...slug]/page.tsx:

```ts
// app/[...slug]/page.tsx

import { notFound } from 'next/navigation';
import { CreateMarkdownPage } from 'rendou';

const MarkdownPage = CreateMarkdownPage({
  /** folder with your `.md`/`.mdx` files (default: "content") */
  contentDir: 'content',
  /** CSS-module key or `"none"` to render without a theme */
  theme: 'rendou-dark',
  /** extra wrapper classes to apply on `<main>` */
  className: 'custom-container',
});

export default MarkdownPage;
// Next.js will call this at build time to generate all paths
export const generateStaticParams = MarkdownPage.generateStaticParams;
```

#### By default:

- Recursively scans nested directories under `content/` for `.md` or `.mdx` files (e.g. `content/blog/2023/post.md` → `slug = ['blog','2023','post'])`.
- If a file is missing, calls `notFound()` (Next.js 404).
- Automatically generates all slug combinations based on your folder structure under `content/`.

## API

#### CreateMarkdownPage(options?)

Returns a Next.js Page component with built-in `generateStaticParams`.

```ts
type RendouTheme = 'rendou-dark' | 'none';

interface MarkdownPageProps {
  /** directory containing your `.md`/`.mdx` files */
  contentDir?: string;
  /** theme key matching your CSS-module (or "none") */
  theme?: RendouTheme;
  /** additional `className` to apply on <main> */
  className?: string;
}

export function CreateMarkdownPage(
  options?: Partial<MarkdownPageProps> = {},
): (props: { params: Promise<{ slug: string[] }> }) => Promise<ReactNode>;
```

- **contentDir:** defaults to `'content'`.
- **theme:** defaults to `'rendou-dark'`. CSS-module keys come from `shared/styles/RendouDark.module.css`.
- **className:** optional wrapper class on `<main>`.

#### The returned component:

- Renders `<main className={${<theme module>} ${className}}>…`
- Renders `<article>{content}</article>` from compileMarkdownFile
- Defines `generateStaticParams()` by scanning contentDir via `getAllSlugs`.

## Project Structure

```bash
packages/next/
├─ src/
│  ├─ CreateMarkdownPage.tsx # main entry
│  └─ shared/
│     ├─ lib/
│     │  ├─ getAllSlugs.ts
│     │  └─ fileWalker.ts
│     ├─ styles/
│     │  └─ RendouDark.module.css
│     ├─ constants.ts
│     └─ types.ts # RendouTheme, utility types
├─ build.config.ts # optional esbuild overrides
├─ package.json
├─ tsconfig.json
└─ README.md
```

## Theming

`shared/styles/RendouDark.module.css` exports a CSS-module mapping:

```css
.rendou-dark {
  /* dark background, text, gutter, etc. */
}
```

Use `theme: 'rendou-dark'` (default) or override to `'none'` to skip any theme.

## License

This project is licensed under the MIT License.

## Contact

**Vladyslav Dobrodii**

- [dobrodii.vlad200@gmail.com](mailto:dobrodii.vlad200@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/vladyslav-dobrodii-20384a233/)
- [GitHub](https://github.com/dladislav201/)
