import {
  getBadRequestResponse,
  getInvalidParamsResult,
  getOkResponse,
  getValidParamsResult,
} from '@shared/BaseService/BaseService.types';
import {consolidateUsage} from './Usage.behavior.utils';
import {unwrapInvalidParams, type UsageParams} from './Usage.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';

const INVALID_PARAMS_MESSAGE = 'Invalid usage summary params';

export const usageBehavior: IServiceBehavior<UsageParams> = {
  validateParams: (params, logger) => {
    if (unwrapInvalidParams(params)) {
      logger.warn(`${INVALID_PARAMS_MESSAGE}: ${JSON.stringify(params)}`);

      return getInvalidParamsResult(
        getBadRequestResponse(INVALID_PARAMS_MESSAGE),
      );
    }

    return getValidParamsResult(params);
  },

  run: async (validParams, logger) => {
    if (!('namespace' in validParams)) {
      logger.info('Generating `full` usage summary');

      return getOkResponse(await consolidateUsage());
    }

    if (!('name' in validParams) || validParams.name === null) {
      logger.info(`Generating \`${validParams.namespace}/\` usage summary`);

      return getOkResponse(await consolidateUsage(validParams.namespace));
    }

    logger.info(
      `Generating \`${validParams.namespace}/${validParams.name}\` usage summary`,
    );

    return getOkResponse(
      await consolidateUsage(validParams.namespace, validParams.name),
    );
  },
};
