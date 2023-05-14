import {RowDataPacket} from 'mysql2/promise';
import {
  createDbConnection,
  createDbConnectionPool,
  getConnectionConfig,
  getExecuteSingleHandler,
  getQueryHandler,
} from '@shared/MySQL';

const connectionConfig = () =>
  getConnectionConfig(
    process.env.DB_COUNTER_CONNECTIONSTRING,
    process.env.DB_COUNTER_CONNECTIONSTRING,
  );

const getCounterDbConnection = async () =>
  await createDbConnection(connectionConfig());

export const createCounterDbConnectionPool = () =>
  createDbConnectionPool(connectionConfig());

export const counterQueryHandler = async <TResult extends RowDataPacket>() =>
  getQueryHandler<TResult>(await getCounterDbConnection());

export const counterExecuteSingleHandler = async () =>
  getExecuteSingleHandler(await getCounterDbConnection());
