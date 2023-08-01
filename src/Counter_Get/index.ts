import {getCount} from '../CounterService';
import type {AzureFunction, Context, HttpRequest} from '@azure/functions';

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest,
): Promise<void> {
  await getCount(context, req);
};

export default httpTrigger;
