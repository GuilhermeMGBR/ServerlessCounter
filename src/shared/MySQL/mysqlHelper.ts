import {createConnection, createPool} from 'mysql2/promise';

import type {
  ConnectionOptions,
  FieldPacket,
  OkPacket,
  RowDataPacket,
} from 'mysql2/promise';
import type {
  IConnection,
  IExecuteHandler,
  IExecuteSingleConnection,
  IExecuteSingleResult,
  IGetQueryHandler,
  IQueryConnection,
  PoolHandler,
  SQLValues,
} from './mysqlHelper.types';

export const getConnectionConfig = (
  connectionString: string,
  rejectUnauthorized?: string,
) => ({
  uri: connectionString,
  ssl: {
    rejectUnauthorized: rejectUnauthorized === 'false' ? false : true,
  },
});

export const createDbConnection = async (
  config: ConnectionOptions,
): Promise<IConnection> => await createConnection(config);

export const createDbConnectionPool = (
  config: ConnectionOptions,
): PoolHandler => createPool(config);

export const query: IGetQueryHandler<IQueryConnection> =
  (connection: IQueryConnection) =>
  async <TQueryResult extends RowDataPacket>(
    sql: string,
    values: SQLValues,
  ) => {
    await connection.connect();

    return await connection.query<TQueryResult[]>(sql, values);
  };

export const getQueryHandler: IGetQueryHandler<IConnection> =
  (connection: IConnection) =>
  async <TQueryResult extends RowDataPacket>(
    sql: string,
    values: SQLValues,
  ) => {
    const result = await query<TQueryResult>(connection)(sql, values);

    await connection.end();
    return result;
  };

export const getPooledQueryHandler =
  async (pool: PoolHandler) =>
  async <TQueryResult extends RowDataPacket>(
    sql: string,
    values: SQLValues,
  ) => {
    const connection = await pool.getConnection();

    const result = await query<TQueryResult>(connection)(sql, values);

    connection.release();
    return result;
  };

export const executeSingle =
  (connection: IExecuteSingleConnection) =>
  async (sql: string, values: SQLValues): IExecuteSingleResult => {
    await connection.connect();
    await connection.beginTransaction();

    const result = await connection.execute<OkPacket>(sql, values);

    if (result[0].affectedRows > 1) {
      await connection.rollback();
      throw new Error('execute single rollback');
    }

    await connection.commit();
    return result;
  };

export const getExecuteSingleHandler: (
  connection: IConnection,
) => IExecuteHandler =
  (connection: IConnection) =>
  async (
    sql: string,
    values: SQLValues,
  ): Promise<[OkPacket, FieldPacket[]]> => {
    const result = await executeSingle(connection)(sql, values);

    await connection.end();

    return result;
  };

export const getPooledExecuteSingleHandler =
  async (pool: PoolHandler) =>
  async (
    sql: string,
    values: SQLValues,
  ): Promise<[OkPacket, FieldPacket[]]> => {
    const connection = await pool.getConnection();

    const result = await executeSingle(connection)(sql, values);

    connection.release();

    return result;
  };
