import {z, ZodSchema} from 'zod';
import {Context} from '@azure/functions';

const lettersOrnumbers = /^[a-zA-Z0-9]*$/;

export const zodStringWithLettersOrNumbers = z
  .string()
  .trim()
  .regex(lettersOrnumbers, 'Invalid format');

export type Invalid<T> = T & 'invalid';

export const unwrapInvalidData =
  (schema: ZodSchema) =>
  <T>(data: T | Invalid<T>): data is Invalid<T> =>
    !schema.safeParse(data).success;

export interface IServiceBehavior<ValidParams, InvalidParams> {
  unwrapInvalidParams: (
    context: Context,
    params: ValidParams | InvalidParams,
  ) => params is InvalidParams;

  run: (context: Context, params: ValidParams) => Promise<void>;
}
