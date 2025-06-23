# Rendou Monorepo

This repository contains two interrelated packages for Markdown-driven React/Next.js sites:

- [`@rendou/core`](./packages/rendou-core) — zero-config Markdown → React compiler with frontmatter, GFM, HTML and Shiki syntax highlighting. See the full docs in [packages/rendou-core/README.md](./packages/rendou-core/README.md).

- [`rendou`](./packages/rendou) — all-in-one Next.js App Router factory powered by `@rendou/core`, compiling Markdown and auto-generating slugs, themes & static parameters. See the full docs in [packages/rendou/README.md](./packages/rendou/README.md).

## Installation

This monorepo uses PNPM Workspace [PNPM Workspaces](https://pnpm.io/workspaces).

1. Enable Corepack:

```bash
corepack enable
```

> _If that fails, run `npm install -g corepack@latest`_.

2. Install dependencies.

```bash
pnpm install
```

3. Build all packages (run from the **monorepo root**)

```bash
pnpm run build
```

When you run the build from the repo root, it executes a single script (`scripts/build-packages.ts`) that:

1. Loops through every package in the repo (in the order you’ve configured).
2. Cleans the old `dist/` folder for each package.
3. Emits TypeScript declarations (`.d.ts`) via `tsc --emitDeclarationOnly`.
4. Bundles the source with esbuild (fast ESM output, source maps, minification, CSS-module support).
5. Injects the generated `index.css` import into each bundle.
6. Logs each step with a consistent `“in progress”` → `“success”` format.

## Publishing

Each package is versioned independently under `packages/*/package.json`. To publish:

1. Bump the version in the package’s `package.json`.
2. Run `pnpm run build` from the monorepo root.
3. Run `cd packages/<pkg>` and npm publish.

## License

This project is licensed under the MIT License.

## Contact

**Vladyslav Dobrodii**

- [dobrodii.vlad200@gmail.com](mailto:dobrodii.vlad200@gmail.com)
- [LinkedIn](https://www.linkedin.com/in/vladyslav-dobrodii-20384a233/)
- [GitHub](https://github.com/dladislav201/)
