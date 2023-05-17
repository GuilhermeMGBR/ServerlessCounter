import {z, ZodSchema} from 'zod';
import type {Invalid} from './BaseService/BaseService.types';

const lettersOrnumbers = /^[a-zA-Z0-9]*$/;

export const zodStringWithLettersOrNumbers = z
  .string()
  .trim()
  .regex(lettersOrnumbers, 'Invalid format');

export const unwrapInvalidData =
  (schema: ZodSchema) =>
  <T>(data: T | Invalid<T>): data is Invalid<T> =>
    !schema.safeParse(data).success;
