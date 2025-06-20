import util from 'util';
import chalk from 'chalk';
import { isExecError } from './isExecError';

const prefix = chalk.gray('[build] »');

export const logger = {
  log: (message: string) =>
    console.log(`${prefix} ${chalk.blue('ℹ')} ${message}`),
  success: (message: string) =>
    console.log(`${prefix} ${chalk.green('✔')} ${message}`),
  error: (message: string, err?: unknown) => {
    console.error(`${prefix} ${chalk.red('✖')} ${message}`);

    if (err == null) return;

    if (isExecError(err)) {
      if (err.stdout) console.error(`${prefix} ${chalk.gray(err.stdout)}`);
      if (err.stderr) console.error(`${prefix} ${chalk.red(err.stderr)}`);
      console.error(
        `${prefix} ${chalk.yellow(`Exit code: ${err.code ?? 'unknown'}`)}`,
      );
    } else if (err instanceof Error) {
      console.error(`${prefix} ${err.stack}`);
    } else {
      console.error(
        `${prefix} ${util.inspect(err, { depth: null, colors: true })}`,
      );
    }
  },
  warn: (message: string) =>
    console.log(`${prefix} ${chalk.yellow('⚠')} ${message}`),
};
