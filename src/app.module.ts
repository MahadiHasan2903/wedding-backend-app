import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';
import { MediaModule } from './media/media.module';
import { AccountModule } from './account/account.module';
import { PaymentModule } from './payment/payment.module';
import { MessageModule } from './message/message.module';
import { ReportsModule } from './reports/reports.module';
import { ContactModule } from './contact/contact.module';
import { LocationModule } from './location/location.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StripeModule } from './payment/stripe/stripe.module';
import { MsPackageModule } from './ms-package/msPackage.module';
import { MsPurchaseModule } from './ms-purchase/ms-purchase.module';
import { ConversationModule } from './conversation/conversation.module';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get<string>('NODE_ENV') !== 'production', // ⚠️ Disable in production
        ssl: {
          rejectUnauthorized: false,
        },
      }),
    }),
    MediaModule,
    UsersModule,
    StripeModule,
    AccountModule,
    PaymentModule,
    MessageModule,
    ReportsModule,
    ContactModule,
    LocationModule,
    MsPackageModule,
    MsPurchaseModule,
    ConversationModule,
  ],
})
export class AppModule {}
