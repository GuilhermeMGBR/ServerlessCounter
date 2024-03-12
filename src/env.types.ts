import {ZodIssue, z} from 'zod';

const envSchema = z.object({
  DB_COUNTER_CONNECTIONSTRING: z.string().min(1),
  DB_COUNTER_REJECTUNAUTHORIZED: z.enum(['true', 'false']).default('true'),
  DB_COUNTER_CA: z
    .string()
    .startsWith('-----BEGIN CERTIFICATE-----')
    .endsWith('-----END CERTIFICATE-----')
    .optional(),
  NODE_ENV: z.enum(['development', 'production']),
});

export type Env = z.infer<typeof envSchema>;
export type RawEnv = Partial<{
  DB_COUNTER_CONNECTIONSTRING: string;
  DB_COUNTER_REJECTUNAUTHORIZED: string;
  DB_COUNTER_CA: string;
  NODE_ENV: string;
}>;

export type EnvIssue = ZodIssue;

export const getEnvIssues = (env: RawEnv = process.env) => {
  const envResult = envSchema.safeParse(env);

  if (!envResult.success) {
    return envResult.error.issues;
  }

  return [];
};
