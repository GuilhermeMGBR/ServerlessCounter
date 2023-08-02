import {getCounterValueResponse} from './CounterService.types';

describe('CounterService:Types', () => {
  it.each([0, 1, 165365])(
    'constructs a `CounterValueResponse` (%s)',
    (value: number) => {
      const response = getCounterValueResponse(value);

      expect(response).toStrictEqual({value});
    },
  );
});
