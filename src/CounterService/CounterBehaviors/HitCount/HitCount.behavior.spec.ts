import {
  insertCounter,
  insertCounterHit,
  selectHitCountById,
  selectId,
} from '@CounterService/CounterRepository';
import {
  getInsertCounterMock,
  getSelectHitCountByIdMock,
  getSelectIdMock,
} from '@CounterService/CounterRepository/CounterRepository.mocks';
import {getRowDataPacket} from '@CounterService/CounterRepository/CounterRepository.types';
import {createLoggerMock} from '@shared/logger.mocks';
import {hitCountBehavior} from './HitCount.behavior';
import type {ConnectionOptions, ResultSetHeader} from 'mysql2/promise';
import type {
  SelectIdData,
  HitCountData,
  SelectIdResult,
} from '@CounterService/CounterRepository/CounterRepository.types';
import type {InvalidValidationResult} from '@shared/BaseService/BaseService.types';

jest.mock('@CounterService/CounterRepository', () => ({
  selectId: jest.fn(),
  insertCounter: jest.fn(),
  insertCounterHit: jest.fn(),
  selectHitCountById: jest.fn(),
}));

const mockSelectId = selectId as jest.Mock;
const mockInsertCounter = insertCounter as jest.Mock;
const mockInsertCounterHit = insertCounterHit as jest.Mock;
const mockSelectHitCountById = selectHitCountById as jest.Mock;

const mockConnectionPool_End = jest.fn();
jest.mock('@shared/MySQL', () => ({
  ...jest.requireActual('@shared/MySQL'),
  createDbConnectionPool: (_config: ConnectionOptions) => ({
    end: mockConnectionPool_End,
    getConnection: jest.fn(),
  }),
}));

describe('hitCountBehavior', () => {
  describe('validateParams', () => {
    it.each([
      ['all undefined', undefined, undefined],
      ['empty name', 'a', ''],
      ['empty namespace', '', 'b'],
    ])(
      'identifies invalid params (%s)',
      (_case: string, namespace?: string, name?: string) => {
        const mockLogger = createLoggerMock();

        const validation = hitCountBehavior.validateParams(
          {namespace, name},
          mockLogger,
        );

        expect(validation.valid).toBe(false);

        expect(mockLogger.warn).toHaveBeenCalledWith(
          expect.stringContaining('Invalid hit params:'),
        );

        expect(
          (validation as InvalidValidationResult).invalidParamsHttpResponse,
        ).toStrictEqual({
          body: 'Invalid hit params',
          status: 400,
        });
      },
    );
  });

  describe('run', () => {
    it.each<[string, SelectIdResult[], number]>([
      ['', [getRowDataPacket<SelectIdData>({id: 123})], 123],
      ['after creating inexistent counters', [], 0],
    ])(
      'increments the hit count %s',
      async (_case, currentDbCounterId, previousValue) => {
        const mockLogger = createLoggerMock();

        mockSelectId
          .mockClear()
          .mockImplementationOnce(getSelectIdMock({rows: currentDbCounterId}));

        mockInsertCounter.mockClear().mockImplementationOnce(
          getInsertCounterMock({
            resultSetHeader: {insertId: 12345} as ResultSetHeader,
          }),
        );

        mockInsertCounterHit.mockClear();

        mockSelectHitCountById.mockClear().mockImplementationOnce(
          getSelectHitCountByIdMock({
            rows: [getRowDataPacket<HitCountData>({hits: previousValue + 1})],
          }),
        );

        mockConnectionPool_End.mockClear();

        const result = await hitCountBehavior.run(
          {namespace: 'namespaceXYZ', name: 'nameXYZ'},
          mockLogger,
        );

        if (previousValue === 0) {
          expect(mockLogger.info).toHaveBeenCalledWith(
            'Creating namespaceXYZ/nameXYZ',
          );
        }

        expect(mockSelectId).toHaveBeenCalledTimes(1);
        expect(mockInsertCounter).toHaveBeenCalledTimes(
          previousValue === 0 ? 1 : 0,
        );
        expect(mockInsertCounterHit).toHaveBeenCalledTimes(1);
        expect(mockSelectHitCountById).toHaveBeenCalledTimes(1);
        expect(mockConnectionPool_End).toHaveBeenCalledTimes(1);

        expect(result).toStrictEqual({
          body: JSON.stringify({value: previousValue + 1}),
          status: 200,
        });
      },
    );
  });
});
