import { createHighlighter, type Highlighter } from 'shiki';

let highlighter: Highlighter | undefined;

export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ['slack-dark'],
      langs: ['javascript', 'typescript', 'tsx', 'vue', 'bash', 'css'],
    });
  }
  return highlighter;
}
