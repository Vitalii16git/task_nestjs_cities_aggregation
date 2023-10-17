import { Injectable } from '@nestjs/common';
import * as pgPromise from 'pg-promise';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private db;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    const pgp = pgPromise();
    this.db = pgp(this.getDatabaseUrl());
  }

  private getDatabaseUrl() {
    const user = this.configService.get<string>('POSTGRES_USER');
    const pass = this.configService.get<string>('POSTGRES_PASS');
    const host = this.configService.get<string>('POSTGRES_HOST');
    const port = this.configService.get<string>('POSTGRES_PORT');
    const db = this.configService.get<string>('POSTGRES_DB');

    return `postgres://${user}:${pass}@${host}:${port}/${db}`;
  }

  async query(sql: string, values?: any[]) {
    return this.db.any(sql, values);
  }
}
