import {mockContext} from '../../libs/azure-functions.mocks';
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
      const blocked = getCountBehavior.unwrapInvalidParams(mockContext, {
        namespace,
        name,
      });

      expect(blocked).toBe(true);
      expect(mockContext.log.warn).toHaveBeenCalledWith(
        expect.stringContaining('Invalid get params:'),
      );
      expect(mockContext.res).toStrictEqual({
        body: 'Invalid get params',
        status: 400,
      });
    },
  );
});
