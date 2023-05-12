import {z, ZodSchema} from 'zod';
import {Context, Logger as AzureLogger} from '@azure/functions';

export type Invalid<T> = T & 'invalid';
export type ILogger = AzureLogger;
export type RequestResponse = Context['res'];

export type ValidValidationResponse<TValidParams> = {
  valid: true;
  validParams: TValidParams;
};

export type InvalidValidationResponse = {
  valid: false;
  invalidParamsResponse: RequestResponse;
};

export type ParamValidationResponse<TValidParams> =
  | ValidValidationResponse<TValidParams>
  | InvalidValidationResponse;

const lettersOrnumbers = /^[a-zA-Z0-9]*$/;

export const zodStringWithLettersOrNumbers = z
  .string()
  .trim()
  .regex(lettersOrnumbers, 'Invalid format');

export const unwrapInvalidData =
  (schema: ZodSchema) =>
  <T>(data: T | Invalid<T>): data is Invalid<T> =>
    !schema.safeParse(data).success;

export interface IServiceBehavior<TValidParams, TInvalidParams> {
  validateParams: (
    params: TValidParams | TInvalidParams,
    logger: ILogger,
  ) => ValidValidationResponse<TValidParams> | InvalidValidationResponse;

  run: (params: TValidParams, logger: ILogger) => Promise<RequestResponse>;
}
