import {hasInvalidParams} from './BaseService.utils';
import type {ParamValidationResponse} from './BaseService.types';

describe('BaseService:Utils', () => {
  describe('hasInvalidParams', () => {
    it('returns `true` when the validation response indicates validation errors', () => {
      const invalidValidationResponse: ParamValidationResponse<string> = {
        valid: false,
        invalidParamsResponse: {error: 'Validation error X'},
      };

      const result = hasInvalidParams(invalidValidationResponse);

      expect(result).toBe(true);
      expect(invalidValidationResponse.invalidParamsResponse).not.toBe(
        undefined,
      );
    });

    it('returns `false` when the validation response indicates no validation errors', () => {
      const invalidValidationResponse: ParamValidationResponse<string> = {
        valid: true,
        validParams: 'param X',
      };

      const result = hasInvalidParams(invalidValidationResponse);

      expect(result).toBe(false);
    });
  });
});
