import type {
  InvalidValidationResponse,
  ParamValidationResponse,
} from './BaseService.types';

export const hasInvalidParams = <TValid>(
  validation: ParamValidationResponse<TValid>,
): validation is InvalidValidationResponse => {
  return !validation.valid;
};
