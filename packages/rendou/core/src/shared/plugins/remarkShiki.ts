import type { Plugin } from 'unified';
import { visit } from 'unist-util-visit';
import type { Root, Code, Html } from 'mdast';
import { getHighlighter } from './highlighter';

export const remarkShiki: Plugin<[], Root> = () => {
  return async (tree: Root): Promise<void> => {
    const highlighter = await getHighlighter();

    visit(tree, 'code', (node: Code, index, parent) => {
      const lang =
        node.lang && highlighter.getLoadedLanguages().includes(node.lang)
          ? node.lang
          : 'plaintext';

      const code = highlighter.codeToHtml(node.value, {
        lang,
        theme: 'slack-dark',
      });

      const htmlNode: Html = { type: 'html', value: code };
      if (parent && typeof index === 'number') {
        parent.children[index] = htmlNode;
      }
    });
  };
};
