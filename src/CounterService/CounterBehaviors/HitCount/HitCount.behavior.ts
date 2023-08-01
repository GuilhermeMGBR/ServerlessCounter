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
import {getCounterValueResponse} from '../../CounterService.utils';
import {unwrapInvalidParams, type HitCountParams} from './HitCount.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';

export const hitCountBehavior: IServiceBehavior<HitCountParams> = {
  validateParams: (params, logger) => {
    if (unwrapInvalidParams(params)) {
      logger.warn(`Invalid hit params: ${JSON.stringify(params)}`);

      return {
        valid: false,
        invalidParamsResponse: {body: 'Invalid hit params', status: 400},
      };
    }

    return {valid: true, validParams: params};
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

    return getCounterValueResponse(result[0].hits);
  },
};

// salt + password + creation yyyyMMDDhour + pepper
// Hit token with sha256 and ability to change + config password (reset count + change hit token)
// hash with bcrypt and complexity parameter
