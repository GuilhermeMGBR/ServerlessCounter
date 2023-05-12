import {
  ILogger,
  IServiceBehavior,
  ParamValidationResponse,
  unwrapInvalidData,
} from '../../shared/types';
import {selectHitCount} from '../CounterRepository';
import {
  counterParamsSchema,
  InvalidGetCountParams,
  ValidGetCountParams,
} from '../CounterService.types';
import {getCounterValueResponse} from '../CounterService.utils';

export const getCountBehavior: IServiceBehavior<
  ValidGetCountParams,
  InvalidGetCountParams
> = {
  validateParams: (
    params: ValidGetCountParams | InvalidGetCountParams,
    logger: ILogger,
  ): ParamValidationResponse<ValidGetCountParams> => {
    if (unwrapInvalidData(counterParamsSchema)(params)) {
      logger.warn(`Invalid get params: ${JSON.stringify(params)}`);

      return {
        valid: false,
        invalidParamsResponse: {body: 'Invalid get params', status: 400},
      };
    }

    return {valid: true, validParams: params};
  },

  run: async function (params: ValidGetCountParams, logger: ILogger) {
    const [result] = await selectHitCount(params.namespace, params.name);

    if (!result || result.length === 0) {
      logger.warn(`Not Found: ${JSON.stringify(params)}`);

      return {body: 'Not Found', status: 404};
    }

    return getCounterValueResponse(result[0].hits);
  },
};
