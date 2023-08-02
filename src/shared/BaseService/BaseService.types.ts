import type {
  Context as AzureContext,
  HttpRequest as AzureHttpRequest,
} from '@azure/functions';

export type Context = Pick<AzureContext, 'res' | 'log'>;
export type HttpRequest = Pick<AzureHttpRequest, 'params'>;
export type HttpResponse = AzureContext['res'];

export const getBadRequestResponse = (body: unknown): HttpResponse => ({
  body,
  status: 400,
});

export const getOkResponse = (body: unknown): HttpResponse => ({
  body,
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

type InvalidParamsHttpResponse = Required<HttpResponse>;

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
