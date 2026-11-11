type Environment = 'development' | 'test' | 'production';

interface AppEnv {
  NODE_ENV: Environment;
  PORT: number;
  FRONTEND_URL: string;
  DATABASE_URL: string;
  DATABASE_SSL: boolean;
}

const validEnvironments = new Set<Environment>([
  'development',
  'test',
  'production',
]);

const parseBoolean = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;

  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
};

export const validateEnv = (config: Record<string, unknown>): AppEnv => {
  const nodeEnv = String(config.NODE_ENV ?? 'development');
  const port = Number(config.PORT ?? 4000);
  const frontendUrl = String(config.FRONTEND_URL ?? '');
  const databaseUrl = String(config.DATABASE_URL ?? '');

  if (!validEnvironments.has(nodeEnv as Environment)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error('PORT must be a positive integer.');
  }

  if (!frontendUrl) {
    throw new Error('FRONTEND_URL is required.');
  }

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required.');
  }

  return {
    NODE_ENV: nodeEnv as Environment,
    PORT: port,
    FRONTEND_URL: frontendUrl,
    DATABASE_URL: databaseUrl,
    DATABASE_SSL: parseBoolean(String(config.DATABASE_SSL ?? 'true'), true),
  };
};
