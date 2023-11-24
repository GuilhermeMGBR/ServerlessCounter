// import type {Logger as AzureLogger} from '@azure/functions';

export type ILogger = {
  log(...args: unknown[]): void;
  trace(...args: unknown[]): void;
  debug(...args: unknown[]): void;
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
};
