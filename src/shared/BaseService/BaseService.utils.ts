import type {
  InvalidValidationResult,
  ParamValidationResult,
} from './BaseService.types';

export const hasInvalidParams = <TValid>(
  validation: ParamValidationResult<TValid>,
): validation is InvalidValidationResult => {
  return !validation.valid;
};
