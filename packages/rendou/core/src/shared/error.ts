export class MarkdownError extends Error {
  constructor(
    public code: 'ENOENT' | 'PARSE' | 'VALIDATION',
    message?: string,
  ) {
    super(message);
    this.name = 'MarkdownError';
  }
}
