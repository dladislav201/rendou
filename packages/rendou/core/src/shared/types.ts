import type { ReactNode } from 'react';

export interface CompileResult<FM = Record<string, unknown>> {
  frontmatter: FM;
  content: ReactNode;
}
