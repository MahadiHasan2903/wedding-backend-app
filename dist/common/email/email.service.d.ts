import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private configService;
    private transporter;
    constructor(configService: ConfigService);
    sendMail({ to, from, subject, html, }: {
        to?: string;
        from?: string;
        subject: string;
        html?: string;
    }): Promise<void>;
}
