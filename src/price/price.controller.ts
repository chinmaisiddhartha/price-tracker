import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { PriceService } from './price.service';
import { SetAlertDto } from './dto/set-alert.dto';
import { SwapRateDto } from './dto/swap-rate.dto';

// Handles all price-related endpoints including historical data and alerts
@ApiTags('prices')
@Controller('prices')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  // Fetches price data points from the last 24h, perfect for charts and analysis
  @Get('hourly')
  @ApiOperation({ summary: 'Get hourly prices for the last 24 hours' })
  async getHourlyPrices() {
    return this.priceService.getHourlyPrices();
  }

  // Let users know when their favorite chain hits their target price
  @Post('alerts')
  @ApiOperation({ summary: 'Set price alert for a specific chain' })
  async setAlert(@Body() setAlertDto: SetAlertDto) {
    return this.priceService.setAlert(
      setAlertDto.chain,
      setAlertDto.targetPrice,
      setAlertDto.email,
    );
  }

  // Calculates real-time conversion rates including network fee. hardcoded for 0.3%
  @Get('swap-rate')
  @ApiOperation({ summary: 'Get ETH to BTC swap rate with fees' })
  @ApiResponse({ status: 200, description: 'Returns swap rate and fees' })
  async getSwapRate(@Query() swapRateDto: SwapRateDto) {
    return this.priceService.getSwapRate(swapRateDto.ethAmount);
  }
}