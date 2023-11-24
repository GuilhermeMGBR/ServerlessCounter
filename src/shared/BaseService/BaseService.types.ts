import type {
  InvocationContext as AzureContext,
  HttpRequest as AzureHttpRequest,
  HttpResponseInit,
} from '@azure/functions';

export type Context = Pick<
  AzureContext,
  'log' | 'trace' | 'debug' | 'error' | 'info' | 'warn'
>;

export type HttpRequest = Pick<AzureHttpRequest, 'params'>;
export type HttpResponse = HttpResponseInit;

export type DefinedBody = NonNullable<HttpResponse['body']>;
type InvalidParamsHttpResponse = HttpResponse & {body: DefinedBody};

export const getBadRequestResponse = (
  body: DefinedBody,
): InvalidParamsHttpResponse => ({
  body,
  status: 400,
});

export const getOkResponse = (body: unknown): HttpResponse => ({
  body: JSON.stringify(body),
  status: 200,
});

export type Invalid<T> = Partial<T>;

export type ValidValidationResult<TParams> = {
  valid: true;
  validParams: TParams;
};

export const getValidParamsResult = <TParams>(
  validParams: TParams,
): ValidValidationResult<TParams> => ({
  valid: true,
  validParams,
});

export type InvalidValidationResult = {
  valid: false;
  invalidParamsHttpResponse: InvalidParamsHttpResponse;
};

export const getInvalidParamsResult = (
  httpResponse: InvalidParamsHttpResponse,
): InvalidValidationResult => ({
  valid: false,
  invalidParamsHttpResponse: httpResponse,
});

export type ParamValidationResult<TValidParams> =
  | ValidValidationResult<TValidParams>
  | InvalidValidationResult;
