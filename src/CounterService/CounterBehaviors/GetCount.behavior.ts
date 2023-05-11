import {Context} from '@azure/functions';
import {IServiceBehavior, unwrapInvalidData} from '../../shared/types';
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
  unwrapInvalidParams: (
    context: Context,
    params: ValidGetCountParams | InvalidGetCountParams,
  ): params is InvalidGetCountParams => {
    if (unwrapInvalidData(counterParamsSchema)(params)) {
      context.log.warn(`Invalid get params: ${JSON.stringify(params)}`);

      context.res = {body: 'Invalid get params', status: 400};
      return true;
    }

    return false;
  },

  run: async function (context: Context, params: ValidGetCountParams) {
    const [result] = await selectHitCount(params.namespace, params.name);

    if (!result || result.length === 0) {
      context.log.warn(`Not Found: ${JSON.stringify(params)}`);

      context.res = {body: 'Not Found', status: 404};
      return;
    }

    context.res = getCounterValueResponse(result[0].hits);
  },
};
