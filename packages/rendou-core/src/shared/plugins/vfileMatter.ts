import { matter as vfileMatter } from 'vfile-matter';
import type { Plugin } from 'unified';
import type { VFile } from 'vfile';
import type { Root } from 'mdast';

export const vfileMatterPlugin: Plugin<[], Root, Root> = () => {
  return (_tree: Root, file: VFile) => {
    vfileMatter(file, { strip: true });
  };
};
