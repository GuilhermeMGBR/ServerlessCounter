import {initialize} from 'app';
import {HttpMethod, app} from '@azure/functions';

jest.mock('@azure/functions', () => ({
  app: {
    http: jest.fn(),
  },
}));

describe('app', () => {
  beforeEach(() => {
    (app.http as jest.Mock).mockReset();
  });

  it.each<[string, string, HttpMethod[]]>([
    ['getCount', 'get/{namespace}/{name}', ['GET']],
    ['hitCount', 'hit/{namespace}/{name}', ['GET']],
    ['usage', 'usage/{namespace?}/{name?}', ['GET']],
  ])('registers the %p handler', (handlerName, route, methods) => {
    initialize();

    expect(app.http).toHaveBeenCalledTimes(3);
    expect(app.http).toHaveBeenCalledWith(
      handlerName,
      expect.objectContaining({methods, route}),
    );
  });
});
