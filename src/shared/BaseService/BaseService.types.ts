import type {
  Context as AzureContext,
  HttpRequest as AzureHttpRequest,
} from '@azure/functions';

export type Context = Pick<AzureContext, 'res' | 'log'>;
export type HttpRequest = Pick<AzureHttpRequest, 'params'>;
export type HttpResponse = AzureContext['res'];

export type Invalid<T> = Partial<T>;

export type ValidValidationResponse<TValidParams> = {
  valid: true;
  validParams: TValidParams;
};

export type InvalidValidationResponse = {
  valid: false;
  invalidParamsResponse: HttpResponse;
};

export type ParamValidationResponse<TValidParams> =
  | ValidValidationResponse<TValidParams>
  | InvalidValidationResponse;
