import type {ILogger} from '@shared/logger.types';
import type {
  HttpResponse,
  InvalidValidationResponse,
  Invalid,
  ValidValidationResponse,
} from '../BaseService.types';

export interface IServiceBehavior<TParams> {
  validateParams: (
    params: TParams | Invalid<TParams>,
    logger: ILogger,
  ) => ValidValidationResponse<TParams> | InvalidValidationResponse;

  run: (params: TParams, logger: ILogger) => Promise<HttpResponse>;
}
