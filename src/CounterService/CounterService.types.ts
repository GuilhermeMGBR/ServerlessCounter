import {z} from 'zod';
import {zodNonEmptyStringWithUpto255LettersOrNumbers} from '@shared/types';

export const namespaceSchema = zodNonEmptyStringWithUpto255LettersOrNumbers;
export const nameSchema = zodNonEmptyStringWithUpto255LettersOrNumbers;

export const counterIdentificationParamsSchema = z.object({
  namespace: namespaceSchema,
  name: nameSchema,
});

export type CounterIdentificationParams = z.infer<
  typeof counterIdentificationParamsSchema
>;
