import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const buildTypeOrmOptions = (
  configService: ConfigService,
): TypeOrmModuleOptions => ({
  type: 'postgres',
  url: configService.getOrThrow<string>('DATABASE_URL'),
  autoLoadEntities: true,
  synchronize: false,
  migrationsRun: false,
  ssl: configService.getOrThrow<boolean>('DATABASE_SSL')
    ? { rejectUnauthorized: false }
    : false,
});
