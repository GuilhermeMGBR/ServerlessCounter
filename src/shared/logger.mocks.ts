import type {ILogger} from './logger.types';

export const createLoggerMock = (): ILogger =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.assign((...args: any[]) => jest.fn(...args), {
    log: jest.fn(),
    trace: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  });
