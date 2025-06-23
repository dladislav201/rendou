export class MarkdownError extends Error {
  constructor(
    public code: 'ENOENT' | 'PARSE',
    message?: string,
  ) {
    super(message);
    this.name = 'MarkdownError';
  }
}
