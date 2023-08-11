import {
  deleteSql,
  insertCounterHitSql,
  insertCounterSql,
  selectActiveCountersSql,
  selectHitCountSql,
  selectIdSql,
  selectSql,
  selectStatusSummarySql,
} from './CounterRepository.consts';
import {
  counterExecuteSingleHandler,
  counterQueryHandler,
} from './CounterRepository.utils';
import type {
  IExecuteHandler,
  IQueryHandler,
} from '@shared/MySQL/mysqlHelper.types';
import type {
  ActiveCountersResult,
  HitCountResult,
  SelectCounterResult,
  SelectIdResult,
  StatusSummaryResult,
} from './CounterRepository.types';

export const select = async (
  namespace: string,
  name: string,
  queryHandler: Promise<
    IQueryHandler<SelectCounterResult>
  > = counterQueryHandler(),
) => (await queryHandler)(selectSql, [namespace, name]);

export const selectId = async (
  namespace: string,
  name: string,
  queryHandler: Promise<IQueryHandler<SelectIdResult>> = counterQueryHandler(),
) => (await queryHandler)(selectIdSql, [namespace, name]);

export const selectHitCount = async (
  namespace: string,
  name: string,
  queryHandler: Promise<IQueryHandler<HitCountResult>> = counterQueryHandler(),
) =>
  (await queryHandler)(
    selectHitCountSql + ' AND C.namespace = ? AND C.name = ?',
    [namespace, name],
  );

export const selectHitCountById = async (
  id: number,
  queryHandler: Promise<IQueryHandler<HitCountResult>> = counterQueryHandler(),
) => (await queryHandler)(selectHitCountSql + ' AND C.id = ?', [id.toString()]);

export const selectActiveCounters = async (
  namespace: string | null,
  name: string | null,
  queryHandler: Promise<
    IQueryHandler<ActiveCountersResult>
  > = counterQueryHandler(),
) =>
  (await queryHandler)(selectActiveCountersSql, [
    namespace,
    namespace,
    name,
    name,
  ]);

export const selectStatusSummary = async (
  namespace: string | null,
  name: string | null,
  queryHandler: Promise<
    IQueryHandler<StatusSummaryResult>
  > = counterQueryHandler(),
) =>
  (await queryHandler)(selectStatusSummarySql, [
    namespace,
    namespace,
    name,
    name,
  ]);

export const insertCounter = async (
  namespace: string,
  name: string,
  executeSingleHandler: Promise<IExecuteHandler> = counterExecuteSingleHandler(),
) => (await executeSingleHandler)(insertCounterSql, [namespace, name]);

export const insertCounterHit = async (
  counterId: number,
  executeSingleHandler: Promise<IExecuteHandler> = counterExecuteSingleHandler(),
) => (await executeSingleHandler)(insertCounterHitSql, [counterId.toString()]);

export const deleteCounter = async (
  namespace: string,
  name: string,
  executeSingleHandler: Promise<IExecuteHandler> = counterExecuteSingleHandler(),
) => (await executeSingleHandler)(deleteSql, [namespace, name]);
