import {PoolConnection, SslOptions} from 'mysql2/promise';
import {
  executeSingle,
  getConnectionConfig,
  getExecuteSingleHandler,
  getPooledExecuteSingleHandler,
  getPooledQueryHandler,
  getQueryHandler,
  query,
} from './mysqlHelper';
import {
  getConnectionMock,
  getExecuteSingleConnectionMock,
  getPoolConnectionMock,
  getPoolHandlerMock,
  getQueryConnectionMock,
  getResultSetHeaderMock,
  getTestResult,
} from './mysqlHelper.mocks';
import {SQLValues} from './mysqlHelper.types';

describe('mysqlHelper', () => {
  const testSql = 'select 1';
  const testValues = ['value1'];

  const getMockedExecuteSingleConnection = ({
    affectedRows,
  }: {
    affectedRows: number;
  }) => {
    const queryResult = getResultSetHeaderMock({affectedRows});

    const mockConnection = getExecuteSingleConnectionMock();
    mockConnection.execute.mockResolvedValueOnce([queryResult, []]);
    return mockConnection;
  };

  const expectToExecuteOnceWithValues = (
    mockConnection: ReturnType<typeof getExecuteSingleConnectionMock>,
    sql: string,
    values: SQLValues,
  ) => {
    expect(mockConnection.execute).toHaveBeenCalledWith(sql, values);

    expect(mockConnection.connect).toHaveBeenCalledTimes(1);
    expect(mockConnection.beginTransaction).toHaveBeenCalledTimes(1);
    expect(mockConnection.execute).toHaveBeenCalledTimes(1);
  };

  it('delegates the query and returns results', async (): Promise<void> => {
    const queryResult = getTestResult('result');

    const mockConnection = getQueryConnectionMock();
    mockConnection.query.mockResolvedValueOnce([[queryResult], []]);

    const result = await query(mockConnection)(testSql, testValues);

    expect(mockConnection.connect).toHaveBeenCalledTimes(1);

    expect(mockConnection.query).toHaveBeenCalledWith(testSql, testValues);
    expect(mockConnection.query).toHaveBeenCalledTimes(1);

    expect(result[0][0]).toBe(queryResult);
  });

  it('delegates the executeSingle and returns results', async (): Promise<void> => {
    const mockConnection = getMockedExecuteSingleConnection({affectedRows: 1});

    const result = await executeSingle(mockConnection)(testSql, testValues);
    expect(result[0].affectedRows).toBe(1);

    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalledTimes(1);

    expectToExecuteOnceWithValues(mockConnection, testSql, testValues);
  });

  it('blocks the executeSingle from affecting more than a single row', async (): Promise<void> => {
    const mockConnection = getMockedExecuteSingleConnection({affectedRows: 2});

    await expect(
      executeSingle(mockConnection)(testSql, testValues),
    ).rejects.toThrow();

    expect(mockConnection.rollback).toHaveBeenCalledTimes(1);
    expect(mockConnection.commit).not.toHaveBeenCalled();

    expectToExecuteOnceWithValues(mockConnection, testSql, testValues);
  });

  it.each([['query'], ['executeSingle']])(
    'ends the connection on %s complete',
    async (scenario: string): Promise<void> => {
      const mockConnection = getConnectionMock();
      mockConnection.execute.mockResolvedValueOnce([[], []]);

      if (scenario === 'query') {
        await getQueryHandler(mockConnection)(testSql, testValues);
      } else {
        await getExecuteSingleHandler(mockConnection)(testSql, testValues);
      }

      expect(mockConnection.end).toHaveBeenCalledTimes(1);
    },
  );

  it.each([['query'], ['executeSingle']])(
    'releases the pooled connection on %s complete',
    async (scenario: string): Promise<void> => {
      const mockPoolConnection = getPoolConnectionMock();
      mockPoolConnection.execute.mockResolvedValueOnce([[], []]);

      const mockPoolHandler = getPoolHandlerMock();
      mockPoolHandler.getConnection.mockResolvedValue(
        mockPoolConnection as unknown as PoolConnection,
      );

      if (scenario === 'query') {
        await (
          await getPooledQueryHandler(mockPoolHandler)
        )(testSql, testValues);
      } else {
        await (
          await getPooledExecuteSingleHandler(mockPoolHandler)
        )(testSql, testValues);
      }

      expect(mockPoolConnection.release).toHaveBeenCalledTimes(1);
    },
  );

  it('normalizes escaped newlines in the CA certificate', (): void => {
    const config = getConnectionConfig(
      'mysql://user:password@example.com:3306/database',
      'true',
      '-----BEGIN CERTIFICATE-----\\ncertificate-content\\n-----END CERTIFICATE-----',
    );

    expect(config.ssl).toBeDefined();

    const sslConfig = config.ssl as SslOptions;

    expect(sslConfig.ca).toBe(
      '-----BEGIN CERTIFICATE-----\ncertificate-content\n-----END CERTIFICATE-----',
    );

    expect(sslConfig.rejectUnauthorized).toBe(true);
  });
});
