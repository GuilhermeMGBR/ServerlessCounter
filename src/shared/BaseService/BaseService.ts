import {hasInvalidParams} from './BaseService.utils';

import type {IServiceBehavior} from './BaseServiceBehavior/BaseServiceBehavior.types';
import type {
  Context,
  HttpRequest,
  HttpResponse,
  Invalid,
} from './BaseService.types';

export const behaviorWrapper = <TParams>(behavior: IServiceBehavior<TParams>) =>
  async function (
    req: HttpRequest & {params: TParams | Invalid<TParams>},
    context: Context,
  ): Promise<HttpResponse> {
    try {
      const validation = behavior.validateParams(req.params, context);

      if (hasInvalidParams(validation)) {
        return validation.invalidParamsHttpResponse;
      }

      return await behavior.run(validation.validParams, context);
    } catch (err) {
      context.error(err);
      throw err;
    } finally {
      context.log('HTTP trigger function processed a request.');
    }
  };
