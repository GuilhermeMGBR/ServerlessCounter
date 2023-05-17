import {
  createDbConnectionPool,
  getExecuteSingleHandler,
  getQueryHandler,
} from './mysql';

import type {
  Connection,
  ConnectionOptions,
  FieldPacket,
  OkPacket,
  RowDataPacket,
} from 'mysql2/promise';

export type GetQueryHandlerMockProps<TResult> = {
  rows?: TResult[];
  errorMessage?: string;
  fieldPacket?: FieldPacket[];
};

export type GetExecuteSingleHandlerMockProps = {
  okPacket?: OkPacket;
  errorMessage?: string;
  fieldPacket?: FieldPacket[];
};

export const getQueryHandlerMock =
  <TResult extends RowDataPacket>({
    rows,
    errorMessage,
    fieldPacket,
  }: GetQueryHandlerMockProps<TResult>): typeof getQueryHandler<TResult> =>
  (_connection: Connection) =>
  async (_sql: string, _values: string[]) => {
    if (rows) return Promise.resolve([rows, fieldPacket ?? []]);

    return Promise.reject(errorMessage);
  };

export const getExecuteSingleHandlerMock =
  ({
    okPacket,
    errorMessage,
    fieldPacket,
  }: GetExecuteSingleHandlerMockProps): typeof getExecuteSingleHandler =>
  (_connection: Connection) =>
  async (_sql: string, _values: string[]) => {
    if (okPacket) return Promise.resolve([okPacket, fieldPacket ?? []]);

    return Promise.reject(errorMessage);
  };

export const mockConnectionPool_End = jest.fn();
export const mockConnectionPool_getConnection = jest.fn();

export const createDbConnectionPoolMock: typeof createDbConnectionPool = (
  _config: ConnectionOptions,
) => ({
  end: mockConnectionPool_End,
  getConnection: mockConnectionPool_getConnection,
});

export const getMySqlMock = () => ({
  ...jest.requireActual('@shared/MySQL'),
  createDbConnectionPool: createDbConnectionPoolMock,
});
