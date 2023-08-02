import {hasInvalidParams} from './BaseService.utils';

import type {IServiceBehavior} from './BaseServiceBehavior/BaseServiceBehavior.types';
import type {Context, HttpRequest, Invalid} from './BaseService.types';

export const behaviorWrapper = async function <TParams>(
  context: Context,
  req: HttpRequest & {params: TParams | Invalid<TParams>},
  behavior: IServiceBehavior<TParams>,
): Promise<void> {
  try {
    const validation = behavior.validateParams(req.params, context.log);

    if (hasInvalidParams(validation)) {
      context.res = validation.invalidParamsHttpResponse;

      return;
    }

    context.res = await behavior.run(validation.validParams, context.log);

    return;
  } catch (err) {
    context.log.error(err);
    throw err;
  } finally {
    context.log.verbose('HTTP trigger function processed a request.');
  }
};
