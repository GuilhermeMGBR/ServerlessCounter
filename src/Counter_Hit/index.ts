import {AzureFunction, Context, HttpRequest} from '@azure/functions';
import {hitCount} from '../CounterService';
import {
  InvalidHitCountParams,
  ValidHitCountParams,
} from '../CounterService/CounterService.types';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest & {params: ValidHitCountParams | InvalidHitCountParams},
): Promise<void> {
  await hitCount(context, req);
};

export default httpTrigger;
