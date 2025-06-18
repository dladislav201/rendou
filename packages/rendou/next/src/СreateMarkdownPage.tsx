import { compileMarkdownFile, MarkdownError } from '@rendou/core';
import { notFound } from 'next/navigation';
import type { RendouTheme } from './shared/types';

type MarkdownPageProps = {
  contentDir?: string;
  theme?: RendouTheme;
  className?: string;
};

export function CreateMarkdownPage({
  contentDir = 'content',
  theme = 'rendou-dark',
  className = '',
}: Partial<MarkdownPageProps> = {}) {
  const Page = async ({ params }: { params: Promise<{ slug: string[] }> }) => {
    try {
      const { slug } = await params;
      const { content } = await compileMarkdownFile(slug, contentDir);
      const themeClass = theme === 'none' ? '' : theme;
      return (
        <main className={`${themeClass} ${className}`.trim()}>
          <article>{content}</article>
        </main>
      );
    } catch (err) {
      if (err instanceof MarkdownError && err.code === 'ENOENT') {
        notFound();
      }
    }
  };

  return Page;
}
