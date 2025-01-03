import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { PriceController } from './price.controller';
import { PriceService } from './price.service';
import { Price } from './entities/price.entity';
import { Alert } from './entities/alert.entity';
import { EmailModule } from '../email/email.module';

// Handles price tracking and alerts functionality
// Integrates with TypeORM for data persistence
// Uses scheduling for automated price checks
@Module({
  imports: [
    TypeOrmModule.forFeature([Price, Alert]),
    ScheduleModule.forRoot(),
    EmailModule,
  ],
  controllers: [PriceController],
  providers: [PriceService],
})

export class PriceModule {}