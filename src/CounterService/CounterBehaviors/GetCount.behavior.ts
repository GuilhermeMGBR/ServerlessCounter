import {selectHitCount} from '@CounterService/CounterRepository';
import {getCounterValueResponse} from '@CounterService/CounterService.utils';
import {unwrapInvalidData} from '@shared/types';
import {counterParamsSchema} from '../CounterService.types';

import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';
import type {ParamValidationResponse} from '@shared/BaseService/BaseService.types';
import type {ILogger} from '@shared/logger.types';
import type {
  InvalidGetCountParams,
  ValidGetCountParams,
} from '../CounterService.types';

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

      return getCounterValueResponse(0);
    }

    return getCounterValueResponse(result[0].hits);
  },
};
