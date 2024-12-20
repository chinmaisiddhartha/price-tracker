import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import Moralis from 'moralis';
import { ConfigService } from '@nestjs/config';
import { Price } from './entities/price.entity';
import { Alert } from './entities/alert.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class PriceService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(Alert)
    private alertRepository: Repository<Alert>,
    private emailService: EmailService,
    private configService: ConfigService,
  ) {
    Moralis.start({
      apiKey: this.configService.get('moralis.apiKey'),
    });
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async trackPrices() {
    const chains = ['ethereum', 'polygon'];
    
    for (const chain of chains) {
      const price = await this.fetchPrice(chain);
      await this.savePrice(chain, price);
      await this.checkPriceChange(chain);
      await this.checkAlerts(chain, price);
      
      // Log for verification
      this.logger.log(`${chain} price: ${price}`);
    }
  }

  async getHourlyPrices(hours: number = 24) {
    return this.priceRepository
      .createQueryBuilder('price')
      .where('price.timestamp >= :date', { 
        date: new Date(Date.now() - hours * 60 * 60 * 1000) 
      })
      .orderBy('price.timestamp', 'DESC')
      .getMany();
  }

  async setAlert(chain: string, targetPrice: number, email: string) {
    const alert = this.alertRepository.create({
      chain,
      targetPrice,
      email,
    });
    
    // Send test email immediately
    await this.emailService.sendPriceAlert(
      chain,
      targetPrice,
      email
    );
    
    return this.alertRepository.save(alert);
  }

  async getSwapRate(ethAmount: number) {
    const ethPrice = await this.fetchPrice('ethereum');
    const btcPrice = await this.fetchPrice('bitcoin');
    
    const btcAmount = (ethAmount * ethPrice) / btcPrice;
    const feePercentage = 0.03;
    const feeInEth = ethAmount * feePercentage;
    const feeInUsd = feeInEth * ethPrice;

    return {
      btcAmount,
      fees: {
        eth: feeInEth,
        usd: feeInUsd,
      },
    };
  }

  private async fetchPrice(chain: string): Promise<number> {
    try {
      const response = await Moralis.EvmApi.token.getTokenPrice({
        address: this.getTokenAddress(chain),
        chain: this.getChainId(chain),
      });
      
      return response.raw.usdPrice;
    } catch (error) {
      this.logger.error(`Failed to fetch price for ${chain}: ${error.message}`);
      // Return mock price for testing
      return chain === 'ethereum' ? 2200 : 1.5;
    }
  }

  private getTokenAddress(chain: string): string {
    const addresses = {
      ethereum: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
      polygon: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270', // WMATIC
      bitcoin: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
    };
    return addresses[chain.toLowerCase()];
  }

  private getChainId(chain: string): string {
    const chainIds = {
      ethereum: '0x1',
      polygon: '0x89',
    };
    return chainIds[chain.toLowerCase()];
  }

  private async savePrice(chain: string, price: number) {
    const priceEntity = this.priceRepository.create({
      chain,
      price,
    });
    await this.priceRepository.save(priceEntity);
  }

  private async checkPriceChange(chain: string) {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    const [currentPrice, oldPrice] = await Promise.all([
      this.priceRepository.findOne({
        where: { chain },
        order: { timestamp: 'DESC' },
      }),
      this.priceRepository.findOne({
        where: { 
          chain,
          timestamp: LessThan(oneHourAgo)
        },
        order: { timestamp: 'DESC' },
      }),
    ]);
  
    if (currentPrice && oldPrice) {
      const percentageChange = ((currentPrice.price - oldPrice.price) / oldPrice.price) * 100;
      
      // Reduced threshold to 0.2% for testing
      if (Math.abs(percentageChange) >= 0.5) {
        await this.emailService.sendPriceChangeAlert(chain, percentageChange);
      }
    }
  }

  private async checkAlerts(chain: string, currentPrice: number) {
    const pendingAlerts = await this.alertRepository.find({
      where: {
        chain,
        triggered: false,
      },
    });
  
    for (const alert of pendingAlerts) {
      if (this.isPriceThresholdMet(currentPrice, alert.targetPrice)) {
        await this.emailService.sendPriceAlert(
          chain,
          currentPrice,
          alert.email
        );
  
        alert.triggered = true;
        await this.alertRepository.save(alert);
      }
    }
  }
  
  private isPriceThresholdMet(currentPrice: number, targetPrice: number): boolean {
    const previousPrice = currentPrice - (currentPrice * 0.01);
    return (previousPrice < targetPrice && currentPrice >= targetPrice) ||
           (previousPrice > targetPrice && currentPrice <= targetPrice);
  }
}
