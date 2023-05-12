import {createLoggerMock} from '../../shared/logger.mock';
import {InvalidValidationResponse} from '../../shared/types';
import {getCountBehavior} from './GetCount.behavior';

describe('getCountBehavior', () => {
  it.each([
    ['all undefined', undefined, undefined],
    ['all null', null, null],
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
});
