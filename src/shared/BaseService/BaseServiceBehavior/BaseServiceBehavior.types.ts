import type {ILogger} from '@shared/logger.types';
import type {
  HttpResponse,
  InvalidValidationResult,
  Invalid,
  ValidValidationResult,
} from '../BaseService.types';

export interface IServiceBehavior<TParams> {
  validateParams: (
    params: TParams | Invalid<TParams>,
    logger: ILogger,
  ) => ValidValidationResult<TParams> | InvalidValidationResult;

  run: (params: TParams, logger: ILogger) => Promise<HttpResponse>;
}
