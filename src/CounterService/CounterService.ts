import {behaviorWrapper} from '@shared/BaseService';
import {getCountBehavior, hitCountBehavior} from './CounterBehaviors';

import type {AzureFunction, Context, HttpRequest} from '@azure/functions';
import type {
  InvalidGetCountParams,
  InvalidHitCountParams,
  ValidGetCountParams,
  ValidHitCountParams,
} from './CounterService.types';

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
