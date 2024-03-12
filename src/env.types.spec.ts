import {Env, EnvIssue, RawEnv, getEnvIssues} from 'env.types';

const VALID_ENV: Env = {
  DB_COUNTER_CONNECTIONSTRING: 'mysql://[user]:@[url]:[port]/counter',
  DB_COUNTER_REJECTUNAUTHORIZED: 'true',
  DB_COUNTER_CA: '-----BEGIN CERTIFICATE-----ValidCA-----END CERTIFICATE-----',
  NODE_ENV: 'development',
};

describe('env', () => {
  it.each([
    ['all valid', VALID_ENV],
    ['CA undefined', {...VALID_ENV, DB_COUNTER_CA: undefined}],
  ])(
    'accepts valid environment parameters (%s)',
    (_case, environmentParams) => {
      expect(getEnvIssues(environmentParams)).toStrictEqual([]);
    },
  );

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
          minimum: 1,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'String must contain at least 1 character(s)',
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
          received: 'undefined',
          code: 'invalid_enum_value',
          options: ['true', 'false'],
          path: ['DB_COUNTER_REJECTUNAUTHORIZED'],
          message:
            "Invalid enum value. Expected 'true' | 'false', received 'undefined'",
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
          code: 'invalid_string',
          validation: {startsWith: '-----BEGIN CERTIFICATE-----'},
          message:
            'Invalid input: must start with "-----BEGIN CERTIFICATE-----"',
          path: ['DB_COUNTER_CA'],
        },
        {
          code: 'invalid_string',
          validation: {endsWith: '-----END CERTIFICATE-----'},
          message: 'Invalid input: must end with "-----END CERTIFICATE-----"',
          path: ['DB_COUNTER_CA'],
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
          code: 'invalid_enum_value',
          message:
            "Invalid enum value. Expected 'development' | 'production', received 'dev'",
          options: ['development', 'production'],
          path: ['NODE_ENV'],
          received: 'dev',
        },
      ],
    ],
  ])('rejects %s', (_case, environmentParams, issues) => {
    expect(getEnvIssues(environmentParams)).toStrictEqual(issues);
  });
});
