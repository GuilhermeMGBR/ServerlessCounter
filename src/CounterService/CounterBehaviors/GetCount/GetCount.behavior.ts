import {selectHitCount} from '@CounterService/CounterRepository';
import {getCounterValueResponse} from '@CounterService/CounterService.types';
import {
  getBadRequestResponse,
  getInvalidParamsResult,
  getOkResponse,
  getValidParamsResult,
} from '@shared/BaseService/BaseService.types';
import {unwrapInvalidParams, type GetCountParams} from './GetCount.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';

const INVALID_PARAMS_MESSAGE = 'Invalid get params';

export const getCountBehavior: IServiceBehavior<GetCountParams> = {
  validateParams: (params, logger) => {
    if (unwrapInvalidParams(params)) {
      logger.warn(`${INVALID_PARAMS_MESSAGE}: ${JSON.stringify(params)}`);

      return getInvalidParamsResult(
        getBadRequestResponse(INVALID_PARAMS_MESSAGE),
      );
    }

    return getValidParamsResult(params);
  },

  run: async function (params, logger) {
    const [result] = await selectHitCount(params.namespace, params.name);

    if (!result || result.length === 0) {
      logger.warn(`Not Found: ${JSON.stringify(params)}`);

      return getOkResponse(getCounterValueResponse(0));
    }

    return getOkResponse(getCounterValueResponse(result[0].hits));
  },
};
