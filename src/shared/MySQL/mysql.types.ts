import type {
  Connection,
  FieldPacket,
  OkPacket,
  Pool,
  RowDataPacket,
} from 'mysql2/promise';

export type PoolHandler = Pick<Pool, 'end' | 'getConnection'>;

export type IQueryResult = Awaited<ReturnType<Connection['query']>>[0];

export type IQueryHandler<TDataRow extends RowDataPacket> = (
  sql: string,
  values: string[],
) => Promise<[TDataRow[], FieldPacket[]]>;

export type IExecuteHandler = (
  sql: string,
  values: string[],
) => Promise<[OkPacket, FieldPacket[]]>;
