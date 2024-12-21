import { Test, TestingModule } from '@nestjs/testing';
import { PriceController } from '../../src/price/price.controller';
import { PriceService } from '../../src/price/price.service';

describe('PriceController', () => {
  let controller: PriceController;
  let service: PriceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PriceController],
      providers: [
        {
          provide: PriceService,
          useValue: {
            getHourlyPrices: jest.fn(),
            setAlert: jest.fn(),
            getSwapRate: jest.fn().mockImplementation((ethAmount) => ({
              btcAmount: ethAmount * 0.997,  // 0.3% fee deducted
              fees: {
                eth: ethAmount * 0.003,      // 0.3% fee
                usd: ethAmount * 0.003 * 1000 // fee * ETH price ($1000)
              }
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<PriceController>(PriceController);
    service = module.get<PriceService>(PriceService);
  });

  it('should set price alert', async () => {
    const alertData = {
      chain: 'ethereum',
      targetPrice: 2000,
      email: 'test@example.com',
    };

    await controller.setAlert(alertData);
    expect(service.setAlert).toHaveBeenCalledWith(
      alertData.chain,
      alertData.targetPrice,
      alertData.email,
    );
  });

  it('should calculate correct swap rate with fees', async () => {
    const result = await controller.getSwapRate({ ethAmount: 10 });
    expect(result.btcAmount).toBe(9.97);
    expect(result.fees.eth).toBe(0.03);
    expect(result.fees.usd).toBe(30);
  });
});
