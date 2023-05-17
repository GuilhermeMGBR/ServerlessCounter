import type {ILogger} from './logger.types';

export const createLoggerMock = (): ILogger =>
  Object.assign((...args: any[]) => jest.fn(...args), {
    error: jest.fn(),
    warn: jest.fn(),
    info: jest.fn(),
    verbose: jest.fn(),
  });
