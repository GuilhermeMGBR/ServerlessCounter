import type {
  Connection,
  FieldPacket,
  OkPacket,
  Pool,
  PoolConnection,
  RowDataPacket,
} from 'mysql2/promise';

export type PoolHandler = Pick<Pool, 'end' | 'getConnection'>;

type QueryProps = 'connect' | 'query';

type ExecuteSingleProps =
  | 'connect'
  | 'beginTransaction'
  | 'execute'
  | 'rollback'
  | 'commit';

export type IConnection = Pick<
  Connection,
  QueryProps | ExecuteSingleProps | 'end'
>;

export type IPoolConnection = Pick<
  PoolConnection,
  QueryProps | ExecuteSingleProps | 'release'
>;

export type IQueryConnection = Pick<IConnection | IPoolConnection, QueryProps>;

export type IExecuteSingleConnection = Pick<
  IConnection | IPoolConnection,
  ExecuteSingleProps
>;

export type IGetQueryHandler<TConnection extends IQueryConnection> = <
  TResult extends RowDataPacket,
>(
  connection: TConnection,
) => IQueryHandler<TResult>;

export type IQueryHandler<TDataRow extends RowDataPacket> = (
  sql: string,
  values: string[],
) => Promise<[TDataRow[], FieldPacket[]]>;

export type IQueryResult = Awaited<
  ReturnType<Connection['query'] | PoolConnection['query']>
>[0];

export type IExecuteHandler = (
  sql: string,
  values: string[],
) => Promise<[OkPacket, FieldPacket[]]>;

export type IExecuteSingleResult = Promise<[OkPacket, FieldPacket[]]>;
