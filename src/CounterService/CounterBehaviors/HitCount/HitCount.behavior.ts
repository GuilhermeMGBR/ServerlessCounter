import {
  getBadRequestResponse,
  getInvalidParamsResult,
  getOkResponse,
  getValidParamsResult,
} from '@shared/BaseService/BaseService.types';
import {
  getPooledExecuteSingleHandler,
  getPooledQueryHandler,
} from '@shared/MySQL';
import {
  insertCounter,
  insertCounterHit,
  selectHitCountById,
  selectId,
} from '../../CounterRepository';
import {createCounterDbConnectionPool} from '../../CounterRepository/CounterRepository.utils';
import {getCounterValueResponse} from '../../CounterService.types';
import {unwrapInvalidParams, type HitCountParams} from './HitCount.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';

const INVALID_PARAMS_MESSAGE = 'Invalid hit params';

export const hitCountBehavior: IServiceBehavior<HitCountParams> = {
  validateParams: (params, logger) => {
    if (unwrapInvalidParams(params)) {
      logger.warn(`Invalid hit params: ${JSON.stringify(params)}`);

      return getInvalidParamsResult(
        getBadRequestResponse(INVALID_PARAMS_MESSAGE),
      );
    }

    return getValidParamsResult(params);
  },

  run: async (params, logger) => {
    const pool = createCounterDbConnectionPool();

    const [current] = await selectId(
      params.namespace,
      params.name,
      getPooledQueryHandler(pool),
    );

    let counterId =
      !current || current.length === 0 || current[0]?.id === 0
        ? 0
        : current[0].id;

    if (counterId === 0) {
      logger.info(`Creating ${params.namespace}/${params.name}`);

      const [details] = await insertCounter(
        params.namespace,
        params.name,
        getPooledExecuteSingleHandler(pool),
      );

      counterId = details.insertId;
    }

    await insertCounterHit(counterId, getPooledExecuteSingleHandler(pool));

    const [result] = await selectHitCountById(
      counterId,
      getPooledQueryHandler(pool),
    );

    await pool.end();

    return getOkResponse(getCounterValueResponse(result[0].hits));
  },
};
