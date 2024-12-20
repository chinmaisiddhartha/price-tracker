import { IsString, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SetAlertDto {
  @ApiProperty({ example: 'ethereum' })
  @IsString()
  chain: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  targetPrice: number;

  @ApiProperty({ example: 'example@email.com' })
  @IsEmail()
  email: string;
}
