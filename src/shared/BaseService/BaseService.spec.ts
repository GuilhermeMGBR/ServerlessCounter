import {createLoggerMock} from '@shared/logger.mocks';
import {behaviorWrapper} from './BaseService';
import {createServiceBehaviorMock} from './BaseServiceBehavior/BaseServiceBehavior.mocks';

import type {Context, ParamValidationResult} from './BaseService.types';

type TestParams = {param1: string};

describe('behaviorWrapper', () => {
  it.each([
    ['allows', 'valid', true, {param1: 'valid'}],
    ['blocks', 'invalid', false, {param1: 'invalid'}],
  ])(
    '%s behavior execution when unwrapping %s params (%s)',
    async (
      _case0: string,
      _case1: string,
      valid: boolean,
      params: TestParams,
    ): Promise<void> => {
      const invalidParamsHttpResponse = {body: 'params1 is invalid'};

      const validationResult: ParamValidationResult<TestParams> = valid
        ? {valid, validParams: params}
        : {valid, invalidParamsHttpResponse};

      const runResultWhenValid = {a: 'xyz'};

      const mockLogger = createLoggerMock();
      const context: Context = mockLogger;

      const mockServiceBehavior = createServiceBehaviorMock<
        Required<TestParams>
      >({
        mockValidateParams: jest.fn().mockReturnValueOnce(validationResult),
        mockRun: jest.fn().mockReturnValueOnce(runResultWhenValid),
      });

      const response = await behaviorWrapper(mockServiceBehavior)(
        {params},
        context,
      );

      expect(mockServiceBehavior.validateParams).toHaveBeenCalledTimes(1);
      expect(mockServiceBehavior.validateParams).toHaveBeenCalledWith(
        params,
        mockLogger,
      );

      if (valid) {
        expect(mockServiceBehavior.run).toHaveBeenCalledWith(
          params,
          mockLogger,
        );
        expect(mockServiceBehavior.run).toHaveBeenCalledTimes(1);

        expect(response).toBe(runResultWhenValid);
        expect(mockLogger.log).toHaveBeenCalledTimes(1);
        return;
      }

      expect(mockServiceBehavior.run).not.toHaveBeenCalled();

      expect(response).toBe(invalidParamsHttpResponse);
      expect(mockLogger.log).toHaveBeenCalledTimes(1);
    },
  );

  it.each([
    ['validateParams', true],
    ['run', false],
  ])(
    'logs behavior errors (%s)',
    async (_desc0: string, errorOnValidation: boolean): Promise<void> => {
      const context: Context = createLoggerMock();
      const params = {};

      const validateParamsError = new Error('validateParams Error');
      const runError = new Error('run Error');
      const expectedError = errorOnValidation ? validateParamsError : runError;

      const mockServiceBehavior = createServiceBehaviorMock({
        mockValidateParams: jest.fn().mockImplementationOnce(() => {
          if (errorOnValidation) throw validateParamsError;
          return {valid: true, validParams: {result: 'runResultWhenValid'}};
        }),
        mockRun: jest.fn().mockImplementationOnce(async () => {
          throw runError;
        }),
      });

      await expect(
        behaviorWrapper(mockServiceBehavior)({params}, context),
      ).rejects.toThrow(expectedError);

      expect(context.error).toHaveBeenCalledWith(expectedError);
    },
  );
});
