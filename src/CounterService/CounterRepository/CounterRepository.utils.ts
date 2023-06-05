import {
  createDbConnection,
  createDbConnectionPool,
  getConnectionConfig,
  getExecuteSingleHandler,
  getQueryHandler,
} from '@shared/MySQL';

import type {RowDataPacket} from 'mysql2/promise';

const connectionConfig = () =>
  getConnectionConfig(
    process.env.DB_COUNTER_CONNECTIONSTRING,
    process.env.DB_COUNTER_REJECTUNAUTHORIZED,
  );

const getCounterDbConnection = async () =>
  await createDbConnection(connectionConfig());

export const createCounterDbConnectionPool = () =>
  createDbConnectionPool(connectionConfig());

export const counterQueryHandler = async <TResult extends RowDataPacket>() =>
  getQueryHandler<TResult>(await getCounterDbConnection());

export const counterExecuteSingleHandler = async () =>
  getExecuteSingleHandler(await getCounterDbConnection());
