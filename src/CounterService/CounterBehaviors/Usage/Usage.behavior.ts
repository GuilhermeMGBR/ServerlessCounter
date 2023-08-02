import {consolidateUsage} from './Usage.behavior.utils';
import {unwrapInvalidParams, type UsageParams} from './Usage.types';
import type {IServiceBehavior} from '@shared/BaseService/BaseServiceBehavior/BaseServiceBehavior.types';

const INVALID_PARAMS_MESSAGE = 'Invalid usage summary params';

export const usageBehavior: IServiceBehavior<UsageParams> = {
  validateParams: (params, logger) => {
    if (unwrapInvalidParams(params)) {
      logger.warn(`${INVALID_PARAMS_MESSAGE}: ${JSON.stringify(params)}`);

      return {
        valid: false,
        invalidParamsResponse: {body: INVALID_PARAMS_MESSAGE, status: 400},
      };
    }

    return {valid: true, validParams: params};
  },

  run: async (validParams, logger) => {
    if (!('namespace' in validParams)) {
      logger.info('Generating `full` usage summary');

      return consolidateUsage();
    }

    if (!('name' in validParams) || validParams.name === null) {
      logger.info(`Generating \`${validParams.namespace}/\` usage summary`);

      return consolidateUsage(validParams.namespace);
    }

    logger.info(
      `Generating \`${validParams.namespace}/${validParams.name}\` usage summary`,
    );

    return consolidateUsage(validParams.namespace, validParams.name);
  },
};
