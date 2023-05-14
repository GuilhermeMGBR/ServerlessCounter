import {
  Connection,
  ConnectionOptions,
  createConnection,
  createPool,
  FieldPacket,
  OkPacket,
  PoolConnection,
  RowDataPacket,
} from 'mysql2/promise';
import {IExecuteHandler, IQueryHandler, PoolHandler} from './mysql.types';

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
): Promise<Connection> => await createConnection(config);

export const createDbConnectionPool = (
  config: ConnectionOptions,
): PoolHandler => createPool(config);

export const getQueryHandler: <T extends RowDataPacket>(
  connection: Connection,
) => IQueryHandler<T> =
  (connection: Connection) =>
  async <T extends RowDataPacket>(sql: string, values: string[]) => {
    await connection.connect();

    const result = await connection.query<T[]>(sql, values);

    await connection.end();
    return result;
  };

const getPooledQueryHandlerBase: <T extends RowDataPacket>(
  connection: PoolConnection,
) => IQueryHandler<T> =
  (connection: PoolConnection) =>
  async <T extends RowDataPacket>(sql: string, values: string[]) => {
    await connection.connect();

    const result = await connection.query<T[]>(sql, values);

    connection.release();
    return result;
  };

const executeSingle = async (
  connection: Connection,
  sql: string,
  values: string[],
): Promise<[OkPacket, FieldPacket[]]> => {
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
  connection: Connection,
) => IExecuteHandler =
  (connection: Connection) =>
  async (sql: string, values: string[]): Promise<[OkPacket, FieldPacket[]]> => {
    const result = await executeSingle(connection, sql, values);

    await connection.end();

    return result;
  };

const getPooledExecuteSingleHandlerBase: (
  connection: PoolConnection,
) => IExecuteHandler =
  (connection: PoolConnection) =>
  async (sql: string, values: string[]): Promise<[OkPacket, FieldPacket[]]> => {
    const result = await executeSingle(connection, sql, values);

    connection.release();

    return result;
  };

export const getPooledQueryHandler = async <TQueryResult extends RowDataPacket>(
  pool: PoolHandler,
) => getPooledQueryHandlerBase<TQueryResult>(await pool.getConnection());

export const getPooledExecuteSingleHandler = async (pool: PoolHandler) =>
  getPooledExecuteSingleHandlerBase(await pool.getConnection());
