import chalk from 'chalk';

const prefix = chalk.gray('[build] »');

export const logger = {
  log: (message: string) => console.log(`${prefix} ${message}`),
  success: (message: string) =>
    console.log(`${prefix} ${chalk.green('✔')} ${message}`),
  error: (error: unknown) =>
    console.error(
      `${prefix} ${chalk.red('✖')} ${error instanceof Error ? error.message : error}`,
    ),
  warn: (message: string) =>
    console.log(`${prefix} ${chalk.yellow('⚠')} ${message}`),
};
