import {hitCount} from '../CounterService';
import type {AzureFunction, Context, HttpRequest} from '@azure/functions';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  await hitCount(context, req);
};

export default httpTrigger;
