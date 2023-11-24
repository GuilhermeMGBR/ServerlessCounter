import {HttpHandler} from '@azure/functions';
import {behaviorWrapper} from '@shared/BaseService';
import {
  getCountBehavior,
  hitCountBehavior,
  usageBehavior,
} from './CounterBehaviors';
import type {GetCountParams} from './CounterBehaviors/GetCount/GetCount.types';
import type {HitCountParams} from './CounterBehaviors/HitCount/HitCount.types';
import type {UsageParams} from './CounterBehaviors/Usage/Usage.types';

export const getCount: HttpHandler =
  behaviorWrapper<GetCountParams>(getCountBehavior);

export const hitCount: HttpHandler =
  behaviorWrapper<HitCountParams>(hitCountBehavior);

export const usage: HttpHandler = behaviorWrapper<UsageParams>(usageBehavior);
