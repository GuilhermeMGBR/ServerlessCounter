import {mock} from 'jest-mock-extended';
import {
  createDbConnectionPool,
  getExecuteSingleHandler,
  getQueryHandler,
} from './mysqlHelper';

import type {
  ConnectionOptions,
  FieldPacket,
  ResultSetHeader,
  RowDataPacket,
} from 'mysql2/promise';
import {
  IConnection,
  IExecuteSingleConnection,
  IPoolConnection,
  IQueryConnection,
  PoolHandler,
  SQLValues,
} from './mysqlHelper.types';

export type GetQueryHandlerMockProps<TResult> = {
  rows?: TResult[];
  errorMessage?: string;
  fieldPacket?: FieldPacket[];
};

export type GetExecuteSingleHandlerMockProps = {
  resultSetHeader?: ResultSetHeader;
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
  async (_sql: string, _values: SQLValues) => {
    if (rows) return Promise.resolve([rows, fieldPacket ?? []]);

    return Promise.reject(Error(errorMessage));
  };

export const resolveQueryHandlerMock = <TResult extends RowDataPacket>(
  mockProps: GetQueryHandlerMockProps<TResult>,
) => Promise.resolve(getQueryHandlerMock(mockProps)({} as IConnection));

export const getExecuteSingleHandlerMock =
  ({
    resultSetHeader,
    errorMessage,
    fieldPacket,
  }: GetExecuteSingleHandlerMockProps): typeof getExecuteSingleHandler =>
  (_connection: IConnection) =>
  async (_sql: string, _values: SQLValues) => {
    if (resultSetHeader)
      return Promise.resolve([resultSetHeader, fieldPacket ?? []]);

    return Promise.reject(Error(errorMessage));
  };

export const resolveExecuteSingleHandlerMock = (
  mockProps: GetExecuteSingleHandlerMockProps,
) => Promise.resolve(getExecuteSingleHandlerMock(mockProps)({} as IConnection));

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

export const getResultSetHeaderMock = ({
  affectedRows = 1,
}: {
  affectedRows?: number;
}): ResultSetHeader => ({
  constructor: {
    name: 'ResultSetHeader',
  },
  fieldCount: 1,
  affectedRows,
  changedRows: 0,
  insertId: 123,
  serverStatus: 2,
  warningStatus: 0,
  info: 'Executed successfully',
});

export const prepareQueryHandlerMock = <T extends RowDataPacket[] | undefined>(
  mockedQueryHandler: jest.Mock,
  rows: T,
) => {
  mockedQueryHandler.mockResolvedValue(
    getQueryHandlerMock({rows})({} as unknown as IConnection),
  );
};

export const prepareExecuteSingleHandlerMock = (
  mockedExecuteSingleHandler: jest.Mock,
  mockProps: GetExecuteSingleHandlerMockProps,
) => {
  mockedExecuteSingleHandler.mockResolvedValue(
    getExecuteSingleHandlerMock(mockProps)({} as unknown as IConnection),
  );
};
