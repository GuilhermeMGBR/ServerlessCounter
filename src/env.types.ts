import {z} from 'zod';

export const envSchema = z.object({
  DB_COUNTER_CONNECTIONSTRING: z.string().min(1),
  NODE_ENV: z.enum(['development', 'production']),
});

export type Env = Required<z.infer<typeof envSchema>>;
