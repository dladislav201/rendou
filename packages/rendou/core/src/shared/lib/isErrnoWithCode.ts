export function isErrnoWithCode(
  err: unknown,
  code: string,
): err is NodeJS.ErrnoException & { code: string } {
  return (
    typeof err === 'object' &&
    err !== null &&
    'code' in err &&
    (err as NodeJS.ErrnoException).code === code
  );
}
