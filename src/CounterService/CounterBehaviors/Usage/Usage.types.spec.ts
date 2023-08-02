import {
  getUsageResponse,
  toActiveCountersDto,
  toStatusDto,
  type ActiveCountersDto,
  type StatusDto,
  type UsageResponse,
} from './Usage.types';
import type {
  ActiveCountersData,
  StatusSummaryData,
} from '@CounterService/CounterRepository/CounterRepository.types';

describe('Usage:Types', () => {
  it('maps to ActiveCountersDto', () => {
    const sampleData: ActiveCountersData = {
      namespace: 'namespace1',
      name: 'name1',
      hits: 1,
      createdAt: new Date('2001-01-01T01:01:01.000Z'),
      lastHit: new Date('2002-02-02T02:02:02.000Z'),
    };

    const expectedResult: ActiveCountersDto = {
      namespace: 'namespace1',
      key: 'name1',
      hits: 1,
      createdAt: new Date('2001-01-01T01:01:01.000Z'),
      lastHit: new Date('2002-02-02T02:02:02.000Z'),
    };

    const result = toActiveCountersDto(sampleData);

    expect(result).toStrictEqual(expectedResult);
  });

  it.each([
    [
      {active: null, deleted: null},
      {active: 0, deleted: 0},
    ],
    [
      {active: 1, deleted: null},
      {active: 1, deleted: 0},
    ],
    [
      {active: 2, deleted: 1},
      {active: 2, deleted: 1},
    ],
  ])(
    'maps to StatusDto (%s)',
    (sampleData: StatusSummaryData, expectedDto: StatusDto) => {
      const result = toStatusDto(sampleData);

      expect(result).toStrictEqual(expectedDto);
    },
  );

  it('constructs a UsageResponse', () => {
    const createdAt = new Date('2001-01-01T01:01:01.000Z');
    const lastHit = new Date('2002-02-02T02:02:02.000Z');

    const expectedResult: UsageResponse = {
      activeCounters: [
        {
          namespace: 'namespace1',
          key: 'name1',
          hits: 1,
          createdAt,
          lastHit,
        },
      ],
      status: {active: 1, deleted: 0},
    };

    const result = getUsageResponse(
      [
        {
          namespace: 'namespace1',
          key: 'name1',
          hits: 1,
          createdAt,
          lastHit,
        },
      ],
      {active: 1, deleted: 0},
    );

    expect(result).toStrictEqual(expectedResult);
  });
});
