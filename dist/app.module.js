"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const account_module_1 = require("./account/account.module");
const users_module_1 = require("./users/users.module");
const media_module_1 = require("./media/media.module");
const msPackage_module_1 = require("./ms-package/msPackage.module");
const payment_module_1 = require("./payment/payment.module");
const ms_purchase_module_1 = require("./ms-purchase/ms-purchase.module");
const stripe_module_1 = require("./payment/stripe/stripe.module");
const conversation_module_1 = require("./conversation/conversation.module");
const message_module_1 = require("./message/message.module");
const reports_module_1 = require("./reports/reports.module");
const contact_module_1 = require("./contact/contact.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'postgres',
                    host: configService.get('DB_HOST'),
                    port: configService.get('DB_PORT'),
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                    database: configService.get('DB_NAME'),
                    entities: [__dirname + '/**/*.entity{.ts,.js}'],
                    synchronize: configService.get('NODE_ENV') !== 'production',
                    ssl: {
                        rejectUnauthorized: false,
                    },
                }),
            }),
            stripe_module_1.StripeModule,
            account_module_1.AccountModule,
            users_module_1.UsersModule,
            media_module_1.MediaModule,
            msPackage_module_1.MsPackageModule,
            payment_module_1.PaymentModule,
            ms_purchase_module_1.MsPurchaseModule,
            conversation_module_1.ConversationModule,
            message_module_1.MessageModule,
            reports_module_1.ReportsModule,
            contact_module_1.ContactModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map