import {
  getBadRequestResponse,
  getInvalidParamsResult,
  getOkResponse,
  getValidParamsResult,
} from './BaseService.types';

describe('BaseService:Types', () => {
  it.each([
    ['Ok', 'string content', getOkResponse, 200],
    ['Ok', {value: 10}, getOkResponse, 200],
    ['BadRequest', 'string content', getBadRequestResponse, 400],
    ['BadRequest', {value: 10}, getBadRequestResponse, 400],
  ])(
    'constructs a %s response with `%s`',
    (
      _case: string,
      body: unknown,
      constructor: (body: unknown) => unknown,
      httpStatusCode: number,
    ) => {
      const response = constructor(body);

      expect(response).toStrictEqual({
        body,
        status: httpStatusCode,
      });
    },
  );

  it.each([
    ['string param'],
    [
      {
        value: 10,
      },
    ],
  ])('constructs a `ValidParamsResult` with `%s`', (validParams: unknown) => {
    const response = getValidParamsResult(validParams);

    expect(response).toStrictEqual({
      valid: true,
      validParams,
    });
  });

  it('constructs a `InvalidParamsResult`', () => {
    const response = getInvalidParamsResult({body: 'error X'});

    expect(response).toStrictEqual({
      valid: false,
      invalidParamsHttpResponse: {body: 'error X'},
    });
  });
});
