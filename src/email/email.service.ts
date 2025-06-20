// src/email/email.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { getRequiredConfig } from 'src/utils/helpers';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    const config = this.getSmtpConfig();

    try {
      this.transporter = nodemailer.createTransport({
        host: config.host,
        port: config.port,
        secure: false,
        auth: {
          user: config.user,
          pass: config.pass,
        },
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Unknown error during transporter creation';
      throw new Error(`Failed to initialize transporter: ${message}`);
    }
  }

  private getSmtpConfig() {
    try {
      const host = getRequiredConfig(this.configService, 'SMTP_HOST');
      const port = Number(getRequiredConfig(this.configService, 'SMTP_PORT'));
      const user = getRequiredConfig(this.configService, 'SMTP_USER');
      const pass = getRequiredConfig(this.configService, 'SMTP_PASS');
      return { host, port, user, pass };
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unknown configuration error';
      throw new Error(`Failed to get SMTP config: ${message}`);
    }
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
