import {selectHitCount} from '@CounterService/CounterRepository';
import {getSelectHitCountMock} from '@CounterService/CounterRepository/CounterRepository.mocks';
import {getRowDataPacket} from '@CounterService/CounterRepository/CounterRepository.types';
import {createLoggerMock} from '@shared/logger.mocks';
import {getCountBehavior} from './GetCount.behavior';
import type {
  HitCountData,
  HitCountResult,
} from '@CounterService/CounterRepository/CounterRepository.types';
import type {InvalidValidationResult} from '@shared/BaseService/BaseService.types';

jest.mock('@CounterService/CounterRepository', () => ({
  selectHitCount: jest.fn(),
}));

const mockSelectHitCount = selectHitCount as jest.Mock;

describe('getCountBehavior', () => {
  describe('validateParams', () => {
    it.each([
      ['all undefined', undefined, undefined],
      ['empty name', 'a', ''],
      ['empty namespace', '', 'b'],
    ])(
      'identifies invalid params (%s)',
      (_case: string, namespace?: string, name?: string) => {
        const mockLogger = createLoggerMock();

        const validation = getCountBehavior.validateParams(
          {namespace, name},
          mockLogger,
        );

        expect(validation.valid).toBe(false);

        expect(mockLogger.warn).toHaveBeenCalledWith(
          expect.stringContaining('Invalid get params:'),
        );

        expect(
          (validation as InvalidValidationResult).invalidParamsHttpResponse,
        ).toStrictEqual({
          body: 'Invalid get params',
          status: 400,
        });
      },
    );
  });

  describe('run', () => {
    it.each<[string, HitCountResult[], number]>([
      ['the current count', [getRowDataPacket<HitCountData>({hits: 123})], 123],
      ['0 for not found counters and logs a warning', [], 0],
    ])('returns %s', async (_case, dbResult, expectedValue) => {
      const mockLogger = createLoggerMock();

      mockSelectHitCount
        .mockClear()
        .mockImplementationOnce(getSelectHitCountMock({rows: dbResult}));

      const result = await getCountBehavior.run(
        {namespace: 'namespaceXYZ', name: 'nameXYZ'},
        mockLogger,
      );

      if (expectedValue === 0) {
        expect(mockLogger.warn).toHaveBeenCalledWith(
          'Not Found: {"namespace":"namespaceXYZ","name":"nameXYZ"}',
        );
      }

      expect(mockSelectHitCount).toHaveBeenCalledTimes(1);

      expect(result).toStrictEqual({
        body: JSON.stringify({value: expectedValue}),
        status: 200,
      });
    });

    it.each<[string]>([['selectHitCount']])(
      'throws promise rejections (%s)',
      async errorMethod => {
        const mockLogger = createLoggerMock();

        mockSelectHitCount
          .mockClear()
          .mockImplementationOnce(
            getSelectHitCountMock({errorMessage: 'selectHitCount'}),
          );

        expect(
          getCountBehavior.run(
            {namespace: 'namespaceXYZ', name: 'nameXYZ'},
            mockLogger,
          ),
        ).rejects.toStrictEqual(Error(errorMethod));
      },
    );
  });
});
