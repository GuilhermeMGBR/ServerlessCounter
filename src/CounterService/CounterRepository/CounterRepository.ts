import {IExecuteHandler, IQueryHandler} from '@shared/MySQL/mysql.types';
import {
  insertCounterHitSql,
  insertCounterSql,
  selectHitCountSql,
  selectIdSql,
} from './CounterRepository.consts';
import {HitCountResult, SelectIdResult} from './CounterRepository.types';
import {
  counterExecuteSingleHandler,
  counterQueryHandler,
} from './CounterRepository.utils';

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

export const insertCounter = async (
  namespace: string,
  name: string,
  executeSingleHandler: Promise<IExecuteHandler> = counterExecuteSingleHandler(),
) => (await executeSingleHandler)(insertCounterSql, [namespace, name]);

export const insertCounterHit = async (
  counterId: number,
  executeSingleHandler: Promise<IExecuteHandler> = counterExecuteSingleHandler(),
) => (await executeSingleHandler)(insertCounterHitSql, [counterId.toString()]);
