import {Context} from '@azure/functions';
import {IServiceBehavior, unwrapInvalidData} from '../../shared/types';
import {
  insertCounter,
  insertCounterHit,
  selectHitCountById,
  selectId,
} from '../CounterRepository';
import {getCounterPooledHandlers} from '../CounterRepository/CounterRepository.utils';
import {
  counterParamsSchema,
  InvalidHitCountParams,
  ValidHitCountParams,
} from '../CounterService.types';
import {getCounterValueResponse} from '../CounterService.utils';

export const hitCountBehavior: IServiceBehavior<
  ValidHitCountParams,
  InvalidHitCountParams
> = {
  unwrapInvalidParams: (
    context: Context,
    params: ValidHitCountParams | InvalidHitCountParams,
  ): params is InvalidHitCountParams => {
    if (unwrapInvalidData(counterParamsSchema)(params)) {
      context.log.warn(`Invalid hit params: ${JSON.stringify(params)}`);

      context.res = {body: 'Invalid hit params', status: 400};
      return true;
    }

    return false;
  },

  run: async (context: Context, params: ValidHitCountParams) => {
    const {pool, getPooledQueryHandler, getPooledExecuteSingleHandler} =
      await getCounterPooledHandlers();

    const [current] = await selectId(
      params.namespace,
      params.name,
      getPooledQueryHandler(),
    );

    let counterId =
      !current || current.length === 0 || current[0]?.id === 0
        ? 0
        : current[0].id;

    if (counterId === 0) {
      context.log.info(`Creating ${params.namespace}/${params.name}`);

      const [details] = await insertCounter(
        params.namespace,
        params.name,
        getPooledExecuteSingleHandler(),
      );

      counterId = details.insertId;
    }

    await insertCounterHit(counterId, getPooledExecuteSingleHandler());

    const [result] = await selectHitCountById(
      counterId,
      getPooledQueryHandler(),
    );

    await pool.end();

    context.res = getCounterValueResponse(result[0].hits);
  },
};
