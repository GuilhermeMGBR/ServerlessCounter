import {behaviorWrapper} from '@shared/BaseService';
import {
  getCountBehavior,
  hitCountBehavior,
  usageBehavior,
} from './CounterBehaviors';
import type {GetCountParams} from './CounterBehaviors/GetCount/GetCount.types';
import type {HitCountParams} from './CounterBehaviors/HitCount/HitCount.types';
import type {UsageParams} from './CounterBehaviors/Usage/Usage.types';

import type {AzureFunction, Context, HttpRequest} from '@azure/functions';

export const getCount: AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => await behaviorWrapper<GetCountParams>(context, req, getCountBehavior);

export const hitCount: AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => await behaviorWrapper<HitCountParams>(context, req, hitCountBehavior);

export const usage: AzureFunction = async (
  context: Context,
  req: HttpRequest,
) => await behaviorWrapper<UsageParams>(context, req, usageBehavior);
