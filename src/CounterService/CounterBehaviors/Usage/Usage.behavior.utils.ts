import {
  selectActiveCounters,
  selectStatusSummary,
} from '@CounterService/CounterRepository';
import {
  getUsageResponse,
  toActiveCountersDto,
  toStatusDto,
  type ActiveCountersDto,
  type StatusDto,
} from './Usage.types';

const consolidateActiveCounters = async (
  namespace: string | null,
  name: string | null,
): Promise<ActiveCountersDto[]> => {
  const activeCountersSummaryResult = await selectActiveCounters(
    namespace,
    name,
  );

  return activeCountersSummaryResult[0].map(toActiveCountersDto);
};

const consolidateStatus = async (
  namespace: string | null,
  name: string | null,
): Promise<StatusDto> => {
  const statusSummaryResult = await selectStatusSummary(namespace, name);

  return toStatusDto(statusSummaryResult[0][0]);
};

export const consolidateUsage = async (
  namespace: string | null = null,
  name: string | null = null,
) => {
  const activeCounters = await consolidateActiveCounters(namespace, name);
  const status = await consolidateStatus(namespace, name);

  return {
    body: getUsageResponse(activeCounters, status),
  };
};
