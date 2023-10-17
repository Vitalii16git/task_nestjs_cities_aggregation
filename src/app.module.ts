import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DatabaseService } from './db/db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppService } from './app.service';
import { City } from './db/entities/city.entity';
import { Resident } from './db/entities/resident.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: process.env.POSTGRES_TYPE as any,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASS,
      database: process.env.POSTGRES_DB,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      migrations: [join(__dirname, '**', '*.migration.{ts,js}')],
      migrationsRun: true,
      synchronize: true,
    }),
    TypeOrmModule.forFeature([City, Resident]),
  ],
  controllers: [AppController],
  providers: [DatabaseService, AppService],
})
export class AppModule {}
