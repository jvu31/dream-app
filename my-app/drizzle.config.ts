import type { Config } from 'drizzle-kit';

export default {
  schema: './App/Backend/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  driver: 'expo',
} satisfies Config;