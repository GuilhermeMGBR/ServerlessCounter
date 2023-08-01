import {unwrapInvalidData} from '@shared/types';
import {
  counterIdentificationParamsSchema,
  type CounterIdentificationParams,
} from '@CounterService/CounterService.types';
import type {Invalid} from '@shared/BaseService/BaseService.types';

export type GetCountParams = CounterIdentificationParams;

export const unwrapInvalidParams = (
  params: unknown,
): params is Invalid<GetCountParams> =>
  unwrapInvalidData(counterIdentificationParamsSchema)<GetCountParams>(params);
