import {
  Connection,
  ConnectionOptions,
  createConnection,
  createPool,
  FieldPacket,
  OkPacket,
  Pool,
  PoolConnection,
  RowDataPacket,
} from 'mysql2/promise';
import {IExecuteHandler, IQueryHandler} from './mysql.types';

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
): Promise<Connection> => createConnection(config);

export const createDbConnectionPool = async (
  config: ConnectionOptions,
): Promise<Pool> => createPool(config);

export const getQueryHandler: <T extends RowDataPacket>(
  connection: Connection,
) => Promise<IQueryHandler<T>> =
  async (connection: Connection) =>
  async <T extends RowDataPacket>(sql: string, values: string[]) => {
    await connection.connect();

    const result = await connection.query<T[]>(sql, values);

    await connection.end();
    return result;
  };

export const getPooledQueryHandlerBase: <T extends RowDataPacket>(
  connection: PoolConnection,
) => Promise<IQueryHandler<T>> =
  async (connection: PoolConnection) =>
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
) => Promise<IExecuteHandler> =
  async (connection: Connection) =>
  async (sql: string, values: string[]): Promise<[OkPacket, FieldPacket[]]> => {
    const result = await executeSingle(connection, sql, values);

    await connection.end();

    return result;
  };

export const getPooledExecuteSingleHandlerBase: (
  connection: PoolConnection,
) => Promise<IExecuteHandler> =
  async (connection: PoolConnection) =>
  async (sql: string, values: string[]): Promise<[OkPacket, FieldPacket[]]> => {
    const result = await executeSingle(connection, sql, values);

    connection.release();

    return result;
  };

export const getPooledHandlers = async (config: ConnectionOptions) => {
  const pool = await createDbConnectionPool(config);

  const getPooledQueryHandler = async <TData extends RowDataPacket>() =>
    getPooledQueryHandlerBase<TData>(await pool.getConnection());

  const getPooledExecuteSingleHandler = async () =>
    getPooledExecuteSingleHandlerBase(await pool.getConnection());

  return {pool, getPooledQueryHandler, getPooledExecuteSingleHandler};
};
