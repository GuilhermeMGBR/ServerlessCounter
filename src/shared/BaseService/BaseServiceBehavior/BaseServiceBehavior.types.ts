import type {ILogger} from '@shared/logger.types';
import type {
  InvalidValidationResponse,
  HttpResponse,
  ValidValidationResponse,
} from '../BaseService.types';

export interface IServiceBehavior<TValidParams, TInvalidParams> {
  validateParams: (
    params: TValidParams | TInvalidParams,
    logger: ILogger,
  ) => ValidValidationResponse<TValidParams> | InvalidValidationResponse;

  run: (params: TValidParams, logger: ILogger) => Promise<HttpResponse>;
}
