import {z, ZodSchema} from 'zod';
import type {Invalid} from './BaseService/BaseService.types';

const lettersOrNumbers = /^[a-zA-Z0-9]*$/;

export const zodStringWithLettersOrNumbers = z
  .string()
  .trim()
  .regex(lettersOrNumbers, 'Invalid format');

export const zodNullOrUndefined = z.null().optional();

export const zodNonEmptyStringWithUpto255LettersOrNumbers =
  zodStringWithLettersOrNumbers.min(1).max(255);

export const unwrapInvalidData =
  (schema: ZodSchema) =>
  <T>(data: unknown): data is Invalid<T> =>
    !schema.safeParse(data).success;
