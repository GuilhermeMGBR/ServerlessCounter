import {hasInvalidParams} from './BaseService.utils';
import type {ParamValidationResult} from './BaseService.types';

describe('BaseService:Utils', () => {
  describe('hasInvalidParams', () => {
    it('returns `true` when the validation response indicates validation errors', () => {
      const invalidValidationResponse: ParamValidationResult<string> = {
        valid: false,
        invalidParamsHttpResponse: {body: 'Validation error X'},
      };

      const result = hasInvalidParams(invalidValidationResponse);

      expect(result).toBe(true);
      expect(invalidValidationResponse.invalidParamsHttpResponse).toStrictEqual(
        {body: 'Validation error X'},
      );
    });

    it('returns `false` when the validation response indicates no validation errors', () => {
      const invalidValidationResponse: ParamValidationResult<string> = {
        valid: true,
        validParams: 'param X',
      };

      const result = hasInvalidParams(invalidValidationResponse);

      expect(result).toBe(false);
    });
  });
});
