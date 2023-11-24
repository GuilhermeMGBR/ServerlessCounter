import {
  selectActiveCounters,
  selectStatusSummary,
} from '@CounterService/CounterRepository';
import {hasInvalidParams} from '@shared/BaseService/BaseService.utils';
import {createLoggerMock} from '@shared/logger.mocks';
import {usageBehavior} from './Usage.behavior';
import {
  getRowDataPackets,
  getRowDataPacket,
  type ActiveCountersData,
  type StatusSummaryData,
} from '@CounterService/CounterRepository/CounterRepository.types';
import {
  getUsageResponse,
  toActiveCountersDto,
  toStatusDto,
  type UsageParams,
} from './Usage.types';
import type {
  Invalid,
  InvalidValidationResult,
  ValidValidationResult,
} from '@shared/BaseService/BaseService.types';

jest.mock('@CounterService/CounterRepository', () => ({
  selectActiveCounters: jest.fn(),
  selectStatusSummary: jest.fn(),
}));

const mockSelectActiveCounters = selectActiveCounters as jest.Mock;
const mockSelectStatusSummary = selectStatusSummary as jest.Mock;

type SampleActiveCountersData = ActiveCountersData & {key: string};

const namespace1_name2: SampleActiveCountersData[] = [
  {
    namespace: 'namespace1',
    name: 'name2',
    key: 'name2',
    hits: 2,
    createdAt: new Date('2002-02-02T02:02:02.000Z'),
    lastHit: new Date('2003-03-03T03:03:03.000Z'),
  },
];

const namespace1: SampleActiveCountersData[] = [
  {
    namespace: 'namespace1',
    name: 'name1',
    key: 'name1',
    hits: 1,
    createdAt: new Date('2001-01-01T01:01:01.000Z'),
    lastHit: new Date('2002-02-02T02:02:02.000Z'),
  },
].concat(namespace1_name2);

const full: SampleActiveCountersData[] = [
  {
    namespace: 'namespace0',
    name: 'name1',
    key: 'name1',
    hits: 0,
    createdAt: new Date('2000-01-01T01:01:01.000Z'),
    lastHit: new Date('2001-01-01T01:01:01.000Z'),
  },
].concat(namespace1);

describe('UsageBehavior', () => {
  describe('validateParams', () => {
    it.each([
      ['undefined', 'undefined', {}],
      ['defined', 'undefined', {namespace: 'namespace1'}],
      ['defined', 'defined', {namespace: 'namespace1', name: 'name1'}],
    ])(
      'accepts %s namespace with %s name',
      (
        _caseNamespace: string,
        _caseName: string,
        params: UsageParams | Invalid<UsageParams>,
      ) => {
        const mockLogger = createLoggerMock();

        const validation = usageBehavior.validateParams(params, mockLogger);

        expect(hasInvalidParams(validation)).toBe(false);

        expect(mockLogger.warn).not.toHaveBeenCalled();

        expect(
          (validation as ValidValidationResult<UsageParams>).validParams,
        ).toStrictEqual(params);
      },
    );

    it.each([['undefined', 'defined', {name: 'name1'}]])(
      'rejects %s namespace with %s name',
      (
        _caseNamespace: string,
        _caseName: string,
        params: UsageParams | Invalid<UsageParams>,
      ) => {
        const mockLogger = createLoggerMock();

        const validation = usageBehavior.validateParams(params, mockLogger);

        expect(hasInvalidParams(validation)).toBe(true);

        expect(mockLogger.warn).toHaveBeenCalledWith(
          expect.stringContaining('Invalid usage summary params:'),
        );

        expect(
          (validation as InvalidValidationResult).invalidParamsHttpResponse,
        ).toStrictEqual({
          body: 'Invalid usage summary params',
          status: 400,
        });
      },
    );
  });

  describe('run', () => {
    it.each([
      ['full', {}, full, {active: 100, deleted: 2}],
      [
        'namespace1/',
        {namespace: 'namespace1'},
        namespace1,
        {active: 2, deleted: 1},
      ],
      [
        'namespace1/name2',
        {namespace: 'namespace1', name: 'name2'},
        namespace1_name2,
        {active: 1, deleted: 0},
      ],
    ])(
      'returns `%s` usage summary',
      async (
        summaryType: string,
        params: UsageParams,
        mockActiveCountersData: SampleActiveCountersData[],
        mockStatusSummaryData: StatusSummaryData,
      ) => {
        const mockLogger = createLoggerMock();

        const mockActiveCountersResult = getRowDataPackets(
          mockActiveCountersData,
        );

        const mockStatusSummaryResult = [
          getRowDataPacket<StatusSummaryData>(mockStatusSummaryData),
        ];

        const expectedResponse = getUsageResponse(
          mockActiveCountersData.map(toActiveCountersDto),
          toStatusDto(mockStatusSummaryData),
        );

        mockSelectActiveCounters
          .mockClear()
          .mockResolvedValueOnce([mockActiveCountersResult, []]);

        mockSelectStatusSummary
          .mockClear()
          .mockResolvedValueOnce([mockStatusSummaryResult, []]);

        const httpResponse = await usageBehavior.run(params, mockLogger);

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith(
          `Generating \`${summaryType}\` usage summary`,
        );

        expect(mockSelectActiveCounters).toHaveBeenCalledTimes(1);
        expect(mockSelectActiveCounters).toHaveBeenCalledWith(
          params.namespace ?? null,
          params.name ?? null,
        );

        expect(mockSelectStatusSummary).toHaveBeenCalledTimes(1);
        expect(mockSelectStatusSummary).toHaveBeenCalledWith(
          params.namespace ?? null,
          params.name ?? null,
        );

        expect(httpResponse).toStrictEqual({
          body: JSON.stringify(expectedResponse),
          status: 200,
        });
      },
    );
  });
});
