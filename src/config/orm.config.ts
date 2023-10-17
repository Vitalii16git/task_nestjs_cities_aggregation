import { join } from 'path';

export default {
  type: process.env.POSTGRES_TYPE,
  host: process.env.POSTGRES_HOST,
  port: +process.env.POSTGRES_PORT,
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASS,
  database: process.env.POSTGRES_DB,
  entities: [join(__dirname, '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
  migrationsRun: true,
  synchronize: false,
};
