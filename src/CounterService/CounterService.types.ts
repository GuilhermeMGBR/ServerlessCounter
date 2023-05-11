import {z} from 'zod';
import {Invalid, zodStringWithLettersOrNumbers} from '../shared/types';

export const counterParamsSchema = z.object({
  namespace: zodStringWithLettersOrNumbers.max(255),
  name: zodStringWithLettersOrNumbers.max(255),
});

export type CounterParams = z.infer<typeof counterParamsSchema>;

export type ValidGetCountParams = Required<CounterParams>;
export type InvalidGetCountParams = Invalid<CounterParams>;

export type ValidHitCountParams = ValidGetCountParams;
export type InvalidHitCountParams = InvalidGetCountParams;
