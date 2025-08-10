"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountController = void 0;
const common_1 = require("@nestjs/common");
const signin_dto_1 = require("./dto/signin.dto");
const helpers_1 = require("../utils/helpers");
const account_service_1 = require("./account.service");
const users_enum_1 = require("../users/enum/users.enum");
const create_account_dto_1 = require("./dto/create-account.dto");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
const change_password_dto_1 = require("./dto/change-password.dto");
const public_decorator_1 = require("../common/decorators/public.decorator");
const confirm_registration_dto_1 = require("./dto/confirm-registration.dto");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const forget_password_confirmation_dto_1 = require("./dto/forget-password-confirmation.dto");
let AccountController = class AccountController {
    accountService;
    constructor(accountService) {
        this.accountService = accountService;
    }
    async create(createAccountDto) {
        try {
            const { email, phoneNumber } = createAccountDto;
            const existingAccount = await this.accountService.findByEmailOrPhone(email, phoneNumber);
            if (existingAccount) {
                return {
                    status: common_1.HttpStatus.CONFLICT,
                    success: false,
                    message: `An account with this ${existingAccount.email === email ? 'email' : 'phone number'} already exists.`,
                    data: {},
                };
            }
            const result = await this.accountService.create(createAccountDto);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: result.message,
                data: { ...(result.otp && { otp: result.otp }) },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to create account',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async confirm(body) {
        try {
            const account = await this.accountService.verifyOtp(body.email, body.otp);
            const { password, ...accountWithoutPassword } = account;
            return {
                status: common_1.HttpStatus.CREATED,
                success: true,
                message: 'Account successfully created',
                data: accountWithoutPassword,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'OTP verification failed',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async signin(signinDto) {
        try {
            const { email, password } = signinDto;
            const result = await this.accountService.signin(email, password);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Signin successful',
                data: {
                    user: result.user,
                    accessToken: result.accessToken,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.UNAUTHORIZED,
                success: false,
                message: 'Invalid email or password',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.UNAUTHORIZED);
        }
    }
    async logout() {
        await Promise.resolve();
        return {
            status: common_1.HttpStatus.OK,
            success: true,
            message: 'Logout successful',
            data: {},
        };
    }
    async forgetPasswordRequest(body) {
        try {
            const otp = await this.accountService.forgetPasswordRequest(body.email);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'OTP sent to your email for password reset',
                data: process.env.NODE_ENV === 'production' ? {} : { otp },
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                success: false,
                message: 'Failed to send OTP for password reset',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async verifyForgetPasswordOtp(body) {
        try {
            await this.accountService.verifyForgetPasswordOtp(body.email, body.otp);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'OTP verified successfully',
                data: {},
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Failed to verify OTP',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async resetPassword(body) {
        try {
            await this.accountService.verifyForgetPasswordOtp(body.email, body.otp);
            await this.accountService.resetPassword(body.email, body.newPassword);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Password updated successfully',
                data: {},
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'OTP verification or password update failed',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async changePassword(user, body) {
        try {
            const userId = user.userId;
            const { currentPassword, newPassword } = body;
            await this.accountService.changePassword(userId, currentPassword, newPassword);
            return {
                status: common_1.HttpStatus.OK,
                success: true,
                message: 'Password changed successfully',
                data: {},
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                success: false,
                message: 'Password change failed',
                error: (0, helpers_1.sanitizeError)(error),
            }, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.AccountController = AccountController;
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('registration-request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_account_dto_1.CreateAccountDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "create", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('registration-confirmation'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [confirm_registration_dto_1.ConfirmRegistrationDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "confirm", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('signin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [signin_dto_1.SigninDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "signin", null);
__decorate([
    (0, common_1.Post)('logout'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "logout", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('forget-password-request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "forgetPasswordRequest", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('verify-forget-password-otp'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "verifyForgetPasswordOtp", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [forget_password_confirmation_dto_1.ForgetPasswordConfirmationDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('change-password'),
    (0, roles_decorator_1.Roles)(users_enum_1.UserRole.USER, users_enum_1.UserRole.ADMIN),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "changePassword", null);
exports.AccountController = AccountController = __decorate([
    (0, common_1.Controller)('v1/account'),
    __metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
//# sourceMappingURL=account.controller.js.map