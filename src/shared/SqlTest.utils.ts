import {getExecuteSingleHandler, getQueryHandler} from '@shared/MySQL';
import {getOkPacketMock} from '@shared/MySQL/mysqlHelper.mocks';
import {IConnection, SQLValues} from '@shared/MySQL/mysqlHelper.types';
import Database from 'better-sqlite3';
import fs from 'fs';
import {RowDataPacket} from 'mysql2/promise';
import path from 'path';

export const replaceUtcTimestamp = (sql: string) =>
  sql.replace(/UTC_TIMESTAMP\(\)/g, "datetime('now')");

export const replaceIsNullFunction = (sql: string) =>
  sql.replace(/ISNULL\(([^)]*)\)/g, '$1 IS NULL');

export type DbInstance = ReturnType<typeof Database>;

export const createMemoryDb = (timeout = 1000) =>
  new Database(':memory:', {timeout});

export const getSql = (filename: string, dirname: string = __dirname) => {
  return fs.readFileSync(path.resolve(dirname, filename), 'utf8');
};

export const get =
  <TRow>(db: DbInstance, sql: string) =>
  (params: unknown[]) =>
    db.prepare(sql).all(params) as TRow[];

export const execute = (db: DbInstance, sql: string) => db.prepare(sql).run();

export const executeParam =
  (db: DbInstance, sql: string) =>
  (param0: unknown, ...params: unknown[]) =>
    db.prepare(sql).run(param0, params);

export const getTestQueryHandler =
  <TRow extends RowDataPacket>(db: DbInstance): typeof getQueryHandler<TRow> =>
  (_connection: IConnection) =>
  async (sql: string, values: SQLValues) => {
    const sqliteSql = replaceUtcTimestamp(replaceIsNullFunction(sql));

    const rows = get<TRow>(db, sqliteSql)(values as unknown[]);

    return [rows, []];
  };

export const getTestExecuteSingleHandler =
  (db: DbInstance): typeof getExecuteSingleHandler =>
  (_connection: IConnection) =>
  async (sql: string, values: SQLValues) => {
    const sqliteSql = replaceUtcTimestamp(replaceIsNullFunction(sql));

    const result = executeParam(db, sqliteSql)(values);

    return [getOkPacketMock({affectedRows: result.changes}), []];
  };
