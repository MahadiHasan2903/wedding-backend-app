"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_service_1 = require("./account.service");
const account_controller_1 = require("./account.controller");
const email_module_1 = require("../common/email/email.module");
const jwt_1 = require("@nestjs/jwt");
const jwt_strategy_1 = require("../common/guards/jwt/jwt.strategy");
const user_entity_1 = require("../users/entities/user.entity");
const account_repository_1 = require("./repositories/account.repository");
const msPackage_module_1 = require("../ms-package/msPackage.module");
const ms_purchase_module_1 = require("../ms-purchase/ms-purchase.module");
const users_module_1 = require("../users/users.module");
let AccountModule = class AccountModule {
};
exports.AccountModule = AccountModule;
exports.AccountModule = AccountModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
            email_module_1.EmailModule,
            users_module_1.UsersModule,
            msPackage_module_1.MsPackageModule,
            (0, common_1.forwardRef)(() => ms_purchase_module_1.MsPurchaseModule),
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET,
                signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
            }),
        ],
        providers: [account_service_1.AccountService, account_repository_1.AccountRepository, jwt_strategy_1.JwtStrategy],
        controllers: [account_controller_1.AccountController],
        exports: [account_service_1.AccountService, account_repository_1.AccountRepository],
    })
], AccountModule);
//# sourceMappingURL=account.module.js.map