import { compileMarkdownFile, MarkdownError } from '@rendou/core';
import { notFound } from 'next/navigation';
import { getAllSlugs } from './shared/lib';
import type { RendouTheme } from './shared/types';
import styles from './shared/styles/RendouDark.module.css';

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
      const themeClass = theme === 'none' ? '' : styles[theme];
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

  Page.generateStaticParams = async () =>
    (await getAllSlugs(contentDir)).map((path) => ({ slug: path.split('/') }));

  return Page;
}
