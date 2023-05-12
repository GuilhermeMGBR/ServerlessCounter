import {
  ILogger,
  IServiceBehavior,
  ParamValidationResponse,
  unwrapInvalidData,
} from '../../shared/types';
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
  validateParams: (
    params: ValidHitCountParams | InvalidHitCountParams,
    logger: ILogger,
  ): ParamValidationResponse<ValidHitCountParams> => {
    if (unwrapInvalidData(counterParamsSchema)(params)) {
      logger.warn(`Invalid get params: ${JSON.stringify(params)}`);

      return {
        valid: false,
        invalidParamsResponse: {body: 'Invalid hit params', status: 400},
      };
    }

    return {valid: true, validParams: params};
  },

  run: async (params: ValidHitCountParams, logger: ILogger) => {
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
      logger.info(`Creating ${params.namespace}/${params.name}`);

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

    return getCounterValueResponse(result[0].hits);
  },
};
