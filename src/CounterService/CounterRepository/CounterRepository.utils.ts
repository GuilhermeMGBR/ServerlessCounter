import {Connection, Pool, RowDataPacket} from 'mysql2/promise';
import {
  createDbConnection,
  createDbConnectionPool,
  getConnectionConfig,
  getExecuteSingleHandler,
  getPooledHandlers,
  getQueryHandler,
} from '../../shared/MySQL/mysql.utils';

const connectionConfig = () =>
  getConnectionConfig(
    process.env.DB_COUNTER_CONNECTIONSTRING,
    process.env.DB_COUNTER_CONNECTIONSTRING,
  );

export const getCounterDbConnection = async (): Promise<Connection> =>
  createDbConnection(connectionConfig());

export const getCounterDbConnectionPool = async (): Promise<Pool> =>
  createDbConnectionPool(connectionConfig());

export const counterQueryHandler = async <TResult extends RowDataPacket>() =>
  await getQueryHandler<TResult>(await getCounterDbConnection());

export const counterExecuteSingleHandler = async () =>
  await getExecuteSingleHandler(await getCounterDbConnection());

export const getCounterPooledHandlers = async () =>
  await getPooledHandlers(connectionConfig());
