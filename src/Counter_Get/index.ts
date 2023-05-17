import {getCount} from '../CounterService';

import type {AzureFunction, Context, HttpRequest} from '@azure/functions';
import type {
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
