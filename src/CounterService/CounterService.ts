import {AzureFunction, Context, HttpRequest} from '@azure/functions';
import {IServiceBehavior} from '../shared/types';
import {getCountBehavior} from './CounterBehaviors/GetCount.behavior';
import {hitCountBehavior} from './CounterBehaviors/HitCount.behavior';
import {
  InvalidGetCountParams,
  InvalidHitCountParams,
  ValidGetCountParams,
  ValidHitCountParams,
} from './CounterService.types';
import {hasInvalidParams} from './CounterService.utils';

export const behaviorWrapper: AzureFunction = async function <TValid, TInvalid>(
  context: Context,
  req: HttpRequest & {params: TValid | TInvalid},
  behavior: IServiceBehavior<TValid, TInvalid>,
): Promise<void> {
  try {
    const validation = behavior.validateParams(req.params, context.log);

    if (hasInvalidParams(validation)) {
      context.res = validation.invalidParamsResponse;
      return;
    }

    context.res = await behavior.run(validation.validParams, context.log);
    return;
  } catch (err) {
    context.log.error(err);
    throw err;
  } finally {
    context.log.verbose('HTTP trigger function processed a request.');
  }
};

export const getCount: AzureFunction = async function (
  context: Context,
  req: HttpRequest & {params: ValidGetCountParams | InvalidGetCountParams},
): Promise<void> {
  return await behaviorWrapper(context, req, getCountBehavior);
};

export const hitCount: AzureFunction = async function (
  context: Context,
  req: HttpRequest & {params: ValidHitCountParams | InvalidHitCountParams},
): Promise<void> {
  return await behaviorWrapper(context, req, hitCountBehavior);
};
