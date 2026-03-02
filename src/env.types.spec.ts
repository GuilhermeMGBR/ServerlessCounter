import {Env, EnvIssue, RawEnv, getEnvIssues} from 'env.types';

const VALID_ENV: Env = {
  DB_COUNTER_CONNECTIONSTRING: 'mysql://[user]:@[url]:[port]/counter',
  DB_COUNTER_REJECTUNAUTHORIZED: 'true',
  DB_COUNTER_CA: '-----BEGIN CERTIFICATE-----ValidCA-----END CERTIFICATE-----',
  NODE_ENV: 'development',
};

describe('env', () => {
  it('accepts valid environment parameters', () => {
    expect(getEnvIssues(VALID_ENV)).toStrictEqual([]);
  });

  it.each<[string, RawEnv, EnvIssue[]]>([
    [
      'empty connection string',
      {
        ...VALID_ENV,
        DB_COUNTER_CONNECTIONSTRING: '',
      },
      [
        {
          code: 'too_small',
          inclusive: true,
          message: 'Too small: expected string to have >=1 characters',
          minimum: 1,
          origin: 'string',
          path: ['DB_COUNTER_CONNECTIONSTRING'],
        },
      ],
    ],
    [
      'invalid `reject unauthorized` value',
      {
        ...VALID_ENV,
        DB_COUNTER_REJECTUNAUTHORIZED: 'undefined',
      },
      [
        {
          code: 'invalid_value',
          message: 'Invalid option: expected one of "true"|"false"',
          path: ['DB_COUNTER_REJECTUNAUTHORIZED'],
          values: ['true', 'false'],
        },
      ],
    ],
    [
      'invalid `CA`',
      {
        ...VALID_ENV,
        DB_COUNTER_CA: 'Invalid CA',
      },
      [
        {
          code: 'invalid_format',
          format: 'starts_with',
          message:
            'Invalid string: must start with "-----BEGIN CERTIFICATE-----"',
          origin: 'string',
          path: ['DB_COUNTER_CA'],
          prefix: '-----BEGIN CERTIFICATE-----',
        },
        {
          code: 'invalid_format',
          format: 'ends_with',
          message: 'Invalid string: must end with "-----END CERTIFICATE-----"',
          origin: 'string',
          path: ['DB_COUNTER_CA'],
          suffix: '-----END CERTIFICATE-----',
        },
      ],
    ],
    [
      'invalid `NODE_ENV`',
      {
        ...VALID_ENV,
        NODE_ENV: 'dev',
      },
      [
        {
          code: 'invalid_value',
          message: 'Invalid option: expected one of "development"|"production"',
          path: ['NODE_ENV'],
          values: ['development', 'production'],
        },
      ],
    ],
  ])('rejects %s', (_case, environmentParams, issues) => {
    expect(getEnvIssues(environmentParams)).toStrictEqual(issues);
  });
});
