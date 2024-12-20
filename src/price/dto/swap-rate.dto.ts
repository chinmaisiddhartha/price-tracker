import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SwapRateDto {
  @ApiProperty({ example: 1.5, description: 'Amount of ETH to swap' })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  ethAmount: number;
}
