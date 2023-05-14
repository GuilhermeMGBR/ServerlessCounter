import {getSelectHitCountMock} from '@CounterService/CounterRepository/CounterRepository.mocks';
import {
  getHitCountResult,
  HitCountResult,
} from '@CounterService/CounterRepository/CounterRepository.types';
import {createLoggerMock} from '@shared/logger.mocks';
import {InvalidValidationResponse} from '@shared/types';
import {getCountBehavior} from './GetCount.behavior';
import {selectHitCount} from '@CounterService/CounterRepository';

jest.mock('@CounterService/CounterRepository', () => ({
  selectHitCount: jest.fn(),
}));

describe('getCountBehavior', () => {
  it.each([
    ['all undefined', undefined, undefined],
    ['empty name', 'a', ''],
    ['empty namespace', '', 'b'],
  ])(
    'blocks behavior execution when unwraping invalid params (%s)',
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
        (validation as InvalidValidationResponse).invalidParamsResponse,
      ).toStrictEqual({
        body: 'Invalid get params',
        status: 400,
      });
    },
  );

  it.each<[string, HitCountResult[], number]>([
    ['the current count', [getHitCountResult(123)], 123],
    ['0 for not found counters and logs a warning', [], 0],
  ])('returns %s', async (_case, dbResult, expectedValue) => {
    const mockLogger = createLoggerMock();

    (selectHitCount as jest.Mock)
      .mockClear()
      .mockImplementationOnce(getSelectHitCountMock({rows: dbResult}));

    const result = await getCountBehavior.run(
      {namespace: 'namespaceXYZ', name: 'nameXYZ'},
      mockLogger,
    );

    expect(result).toStrictEqual({body: {value: expectedValue}});

    if (expectedValue === 0) {
      expect(mockLogger.warn).toHaveBeenCalledWith(
        'Not Found: {"namespace":"namespaceXYZ","name":"nameXYZ"}',
      );
    }

    expect(selectHitCount).toHaveBeenCalledTimes(1);
  });
});
