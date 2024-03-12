import {app} from '@azure/functions';
import {getCount, hitCount, usage} from '@CounterService/CounterService';
import {validateEnv} from 'env.types';

export const initialize = () => {
  if (!validateEnv()) return;

  app.http('getCount', {
    methods: ['GET'],
    route: 'get/{namespace}/{name}',
    handler: getCount,
  });

  app.http('hitCount', {
    methods: ['GET'],
    route: 'hit/{namespace}/{name}',
    handler: hitCount,
  });

  app.http('usage', {
    methods: ['GET'],
    route: 'usage/{namespace?}/{name?}',
    handler: usage,
  });
};

initialize();
