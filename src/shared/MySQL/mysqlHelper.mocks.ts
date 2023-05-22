import {mock} from 'jest-mock-extended';
import {
  createDbConnectionPool,
  getExecuteSingleHandler,
  getQueryHandler,
} from './mysqlHelper';

import type {
  ConnectionOptions,
  FieldPacket,
  OkPacket,
  RowDataPacket,
} from 'mysql2/promise';
import {
  IConnection,
  IExecuteSingleConnection,
  IPoolConnection,
  IQueryConnection,
  PoolHandler,
} from './mysqlHelper.types';

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
  (_connection: IQueryConnection) =>
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
  (_connection: IConnection) =>
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

export const getConnectionMock = () => mock<IConnection>();
export const getQueryConnectionMock = () => mock<IQueryConnection>();

export const getPoolConnectionMock = () => mock<IPoolConnection>();
export const getPoolHandlerMock = () => mock<PoolHandler>();

export const getExecuteSingleConnectionMock = () =>
  mock<IExecuteSingleConnection>();

export interface TestResult extends RowDataPacket {
  value: string;
}

export const getTestResult = (value: string): TestResult => ({
  constructor: {
    name: 'RowDataPacket',
  },
  value,
});

export const getOkPacketMock = ({
  affectedRows = 1,
}: {
  affectedRows?: number;
}): OkPacket => ({
  constructor: {
    name: 'OkPacket',
  },
  fieldCount: 1,
  affectedRows,
  changedRows: 0,
  insertId: 123,
  serverStatus: 2,
  warningCount: 0,
  message: 'Executed successfully',
  procotol41: true,
});

//
