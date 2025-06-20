import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST')!,
      port: parseInt(this.configService.get<string>('SMTP_PORT')!),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER')!,
        pass: this.configService.get<string>('SMTP_PASS')!,
      },
    });
  }

  async sendMail(to: string, subject: string, text: string, html?: string) {
    try {
      await this.transporter.sendMail({
        from: `"France Cuba Wedding App" <${this.configService.get<string>('SMTP_USER')}>`,
        to,
        subject,
        text,
        html,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error during sending mail';
      throw new Error(`Failed to send email: ${message}`);
    }
  }
}
