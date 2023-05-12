import {
  InvalidValidationResponse,
  ParamValidationResponse,
} from '../shared/types';

export const hasInvalidParams = <TValid>(
  validation: ParamValidationResponse<TValid>,
): validation is InvalidValidationResponse => {
  return false;
};

export const getCounterValueResponse = (value: number) => ({
  body: {
    value,
  },
});
