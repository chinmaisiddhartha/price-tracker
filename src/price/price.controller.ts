import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { SetAlertDto } from './dto/set-alert.dto';
import { SwapRateDto } from './dto/swap-rate.dto';

@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  async getHourlyPrices() {
    return this.priceService.getHourlyPrices();
  }

  @Post('alerts')
  @ApiOperation({ summary: 'Set price alert for a specific chain' })
  async setAlert(@Body() setAlertDto: SetAlertDto) {
    return this.priceService.setAlert(
      setAlertDto.chain,
      setAlertDto.targetPrice,
      setAlertDto.email,
    );
  }

  @Get('swap-rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate with fees' })
  @ApiResponse({ status: 200, description: 'Returns swap rate and fees' })
  async getSwapRate(@Query() swapRateDto: SwapRateDto) {
    return this.priceService.getSwapRate(swapRateDto.ethAmount);
  }
}
