import {behaviorWrapper} from '@shared/BaseService';
import {getCountBehavior, hitCountBehavior} from './CounterBehaviors';
import type {GetCountParams} from './CounterBehaviors/GetCount/GetCount.types';
import type {HitCountParams} from './CounterBehaviors/HitCount/HitCount.types';

import type {AzureFunction, Context, HttpRequest} from '@azure/functions';

export const getCount: AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => await behaviorWrapper<GetCountParams>(context, req, getCountBehavior);

export const hitCount: AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => await behaviorWrapper<HitCountParams>(context, req, hitCountBehavior);
