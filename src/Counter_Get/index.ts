import {AzureFunction, Context, HttpRequest} from '@azure/functions';
import {getCount} from '../CounterService';
import {
  InvalidGetCountParams,
  ValidGetCountParams,
} from '../CounterService/CounterService.types';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest & {params: ValidGetCountParams | InvalidGetCountParams},
): Promise<void> {
  await getCount(context, req);
};

export default httpTrigger;
