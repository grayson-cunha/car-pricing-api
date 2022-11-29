import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const env = this.configService.get<string>('NODE_ENV');

    if (env === 'production') {
      return {
        type: 'postgres',
        url: this.configService.get<string>('DATABASE_URL'),
        migrationsRun: true,
        entities: ['**/*.entity.js'],
        ssl: {
          rejectUnauthorized: false,
        },
      };
    }

    return {
      type: 'sqlite',
      synchronize: true,
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
      migrationsRun: true,
    };
  }
}
