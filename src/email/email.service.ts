import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

/**
 * Handles all email-related operations in the application
 * Uses nodemailer under the hood to send emails
 */
@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    // Set up the email transport with SMTP config from environment
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

  /**
   * Notifies a user when their price target has been hit
   * @param chain - The token name
   * @param price - The target price that was reached
   * @param email - Where to send the notification
   */
  async sendPriceAlert(chain: string, price: number, email: string) {
    await this.transporter.sendMail({
      from: this.configService.get('email.user'),
      to: email,
      subject: `Price Alert for ${chain}`,
      text: `The price of ${chain} has reached ${price}`,
    });
  }

  /**
   * Sends alerts for significant price movements
   * Useful for monitoring volatile market conditions
   * @param chain - The blockchain/token being monitored
   * @param percentageChange - How much the price moved in the last hour
   */
  async sendPriceChangeAlert(chain: string, percentageChange: number) {
    await this.transporter.sendMail({
      from: this.configService.get('email.user'),
      to: this.configService.get('alertEmail'),
      subject: `${chain} Price Change Alert`,
      text: `${chain} price has changed by ${percentageChange}% in the last hour`,
    });
  }
}