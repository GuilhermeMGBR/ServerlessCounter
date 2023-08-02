import {z} from 'zod';
import {
  nameSchema,
  namespaceSchema,
} from '@CounterService/CounterService.types';
import {unwrapInvalidData, zodNullOrUndefined} from '@shared/types';
import type {Invalid} from '@shared/BaseService/BaseService.types';
import type {
  ActiveCountersData,
  StatusSummaryData,
} from '@CounterService/CounterRepository/CounterRepository.types';

const paramsSchema = z.union([
  z.object({
    namespace: zodNullOrUndefined,
    name: zodNullOrUndefined,
  }),
  z.object({
    namespace: namespaceSchema,
    name: zodNullOrUndefined,
  }),
  z.object({
    namespace: namespaceSchema,
    name: nameSchema,
  }),
]);

export type UsageParams = z.infer<typeof paramsSchema>;

export const unwrapInvalidParams = (
  params: unknown,
): params is Invalid<UsageParams> =>
  unwrapInvalidData(paramsSchema)<UsageParams>(params);

export type ActiveCountersDto = {
  namespace: string;
  key: string;
  hits: number;
  createdAt: Date;
  lastHit: Date;
};

export type StatusDto = {
  active: number;
  deleted: number;
};

export const toActiveCountersDto = (
  activeCounters: ActiveCountersData,
): ActiveCountersDto => ({
  namespace: activeCounters.namespace,
  key: activeCounters.name,
  hits: activeCounters.hits,
  createdAt: activeCounters.createdAt,
  lastHit: activeCounters.lastHit,
});

export const toStatusDto = (statusSummary: StatusSummaryData): StatusDto => ({
  active: statusSummary.active ?? 0,
  deleted: statusSummary.deleted ?? 0,
});

export interface UsageResponse {
  activeCounters: ActiveCountersDto[];
  status: StatusDto;
}

export const getUsageResponse = (
  activeCounters: ActiveCountersDto[],
  status: StatusDto,
): UsageResponse => ({
  activeCounters,
  status,
});
