import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { PriceModule } from './price/price.module';
import { EmailModule } from './email/email.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
        type: 'postgres',
        ...configService.get('database'),
        autoLoadEntities: true,
        synchronize: true, // Set to false in production
      } as TypeOrmModuleOptions),
      inject: [ConfigService],
    }),
    PriceModule,
    EmailModule,
  ],
})

export class AppModule {}
