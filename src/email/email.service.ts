import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('email.host'),
      port: this.configService.get('email.port'),
      secure: false,
      auth: {
        user: this.configService.get('email.user'),
        pass: this.configService.get('email.pass'),
      },
    });
  }

  async sendPriceAlert(chain: string, price: number, email: string) {
    await this.transporter.sendMail({
      from: this.configService.get('email.user'),
      to: email,
      subject: `Price Alert for ${chain}`,
      text: `The price of ${chain} has reached ${price}`,
    });
  }

  async sendPriceChangeAlert(chain: string, percentageChange: number) {
    await this.transporter.sendMail({
      from: this.configService.get('email.user'),
      to: this.configService.get('alertEmail'),
      subject: `${chain} Price Change Alert`,
      text: `${chain} price has changed by ${percentageChange}% in the last hour`,
    });
  }
}
