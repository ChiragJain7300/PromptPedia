import 'dotenv/config';
import 'reflect-metadata';

import { DataSource } from 'typeorm';

const databaseUrl = process.env.DATABASE_URL;
const databaseSsl = process.env.DATABASE_SSL ?? 'true';

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to use the TypeORM CLI.');
}

export default new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*.ts'],
  synchronize: false,
  ssl: ['1', 'true', 'yes', 'on'].includes(databaseSsl.toLowerCase())
    ? { rejectUnauthorized: false }
    : false,
});
