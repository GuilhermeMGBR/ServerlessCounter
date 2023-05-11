import {Context} from '@azure/functions';

export const mockContext = {
  log: {
    info: jest.fn(),
    warn: jest.fn(),
    verbose: jest.fn(),
  },
  res: '',
} as unknown as Context;
