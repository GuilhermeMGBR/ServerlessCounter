import {RowDataPacket} from 'mysql2/promise';
import {
  createDbConnection,
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

const getCounterDbConnection = async () =>
  await createDbConnection(connectionConfig());

export const counterQueryHandler = async <TResult extends RowDataPacket>() =>
  getQueryHandler<TResult>(await getCounterDbConnection());

export const counterExecuteSingleHandler = async () =>
  getExecuteSingleHandler(await getCounterDbConnection());

export const getCounterPooledHandlers = () =>
  getPooledHandlers(connectionConfig());
