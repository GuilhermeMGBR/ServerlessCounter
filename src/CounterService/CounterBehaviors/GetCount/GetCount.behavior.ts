import {selectHitCount} from '@CounterService/CounterRepository';
import {getCounterValueResponse} from '@CounterService/CounterService.utils';
import {unwrapInvalidParams, type GetCountParams} from './GetCount.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';

export const getCountBehavior: IServiceBehavior<GetCountParams> = {
  validateParams: (params, logger) => {
    if (unwrapInvalidParams(params)) {
      logger.warn(`Invalid get params: ${JSON.stringify(params)}`);

      return {
        valid: false,
        invalidParamsResponse: {body: 'Invalid get params', status: 400},
      };
    }

    return {valid: true, validParams: params};
  },

  run: async function (params, logger) {
    const [result] = await selectHitCount(params.namespace, params.name);

    if (!result || result.length === 0) {
      logger.warn(`Not Found: ${JSON.stringify(params)}`);

      return getCounterValueResponse(0);
    }

    return getCounterValueResponse(result[0].hits);
  },
};
