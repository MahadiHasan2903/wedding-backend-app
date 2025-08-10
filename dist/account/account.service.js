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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountService = void 0;
const bcrypt = require("bcrypt");
const common_1 = require("@nestjs/common");
const account_repository_1 = require("./repositories/account.repository");
const email_service_1 = require("../common/email/email.service");
const jwt_1 = require("@nestjs/jwt");
const users_enum_1 = require("../users/enum/users.enum");
const msPackage_repository_1 = require("../ms-package/repositories/msPackage.repository");
const ms_purchase_enum_1 = require("../ms-purchase/enum/ms-purchase.enum");
const ms_purchase_service_1 = require("../ms-purchase/ms-purchase.service");
const user_repository_1 = require("../users/repositories/user.repository");
let AccountService = class AccountService {
    msPackageRepo;
    msPurchaseService;
    accountRepo;
    usersRepository;
    emailService;
    jwtService;
    otpStore = new Map();
    forgetPasswordOtpStore = new Map();
    constructor(msPackageRepo, msPurchaseService, accountRepo, usersRepository, emailService, jwtService) {
        this.msPackageRepo = msPackageRepo;
        this.msPurchaseService = msPurchaseService;
        this.accountRepo = accountRepo;
        this.usersRepository = usersRepository;
        this.emailService = emailService;
        this.jwtService = jwtService;
    }
    async findByEmailOrPhone(email, phone) {
        return this.accountRepo.findByEmailOrPhone(email, phone);
    }
    async create(createAccountDto) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.otpStore.set(createAccountDto.email, {
            otp,
            userData: createAccountDto,
        });
        await this.sendOtpEmail(createAccountDto.email, otp);
        const response = {
            message: 'OTP sent to your email.',
        };
        if (process.env.NODE_ENV === 'development') {
            response.otp = otp;
        }
        return response;
    }
    async sendOtpEmail(to, otp) {
        const subject = 'Your OTP Code';
        const html = `
      <p>Hello,</p>
      <p>Your verification code for <strong>France & Cuba Wedding App</strong> is:</p>
      <h2 style="color:#333;">${otp}</h2>
      <p>Please use this code to complete your registration.</p>
      <p>If you did not request this, you can ignore this email.</p>
      <br/>
      <p>— France Cuba Wedding App Team</p>
    `;
        await this.emailService.sendMail({
            to,
            subject,
            html,
        });
    }
    async verifyOtp(email, otp) {
        const record = this.otpStore.get(email);
        if (!record) {
            throw new Error('No OTP request found for this email');
        }
        if (record.otp !== otp) {
            throw new Error('Invalid OTP');
        }
        const hashedPassword = await bcrypt.hash(record.userData.password, 10);
        const { profilePicture, additionalPhotos, ...rest } = record.userData;
        const account = this.accountRepo.create({
            ...rest,
            password: hashedPassword,
        });
        const savedAccount = await this.accountRepo.save(account);
        const defaultPackage = await this.msPackageRepo.findOne({
            where: { id: 1 },
        });
        if (!defaultPackage) {
            throw new Error('Default membership package not found');
        }
        const purchaseInfo = await this.msPurchaseService.createPurchase(savedAccount.id, defaultPackage.id, ms_purchase_enum_1.PurchasePackageCategory.LIFETIME);
        savedAccount.purchasedMembership = purchaseInfo.id;
        await this.accountRepo.save(savedAccount);
        const userWithMembership = {
            ...savedAccount,
        };
        this.otpStore.delete(email);
        return userWithMembership;
    }
    async signin(email, password) {
        const account = await this.accountRepo.findByEmail(email);
        if (!account) {
            throw new Error('Invalid credentials');
        }
        if (account.accountStatus === users_enum_1.AccountStatus.BLOCK) {
            throw new Error('Your account has been blocked. Please contact support for assistance.');
        }
        else if (account.accountStatus === users_enum_1.AccountStatus.DELETE) {
            throw new Error('Your account has been deleted and cannot be accessed.');
        }
        const passwordValid = await bcrypt.compare(password, account.password);
        if (!passwordValid) {
            throw new Error('Invalid credentials');
        }
        if (account.accountStatus === users_enum_1.AccountStatus.INACTIVE) {
            account.accountStatus = users_enum_1.AccountStatus.ACTIVE;
            await this.accountRepo.save(account);
        }
        const enrichedUserDetails = await this.usersRepository.enrichUserRelations(account);
        const payload = {
            userId: account.id,
            email: account.email,
            userRole: account.userRole,
        };
        const accessToken = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: process.env.JWT_EXPIRES_IN || '1d',
        });
        return {
            user: {
                id: account.id,
                firstName: account.firstName,
                lastName: account.lastName,
                email: account.email,
                phoneNumber: account.phoneNumber ?? null,
                userRole: account.userRole,
                accountStatus: account.accountStatus,
                profilePicture: enrichedUserDetails.profilePicture,
                purchasedMembership: enrichedUserDetails.purchasedMembership,
            },
            accessToken,
        };
    }
    async changePassword(userId, currentPassword, newPassword) {
        const account = await this.accountRepo.findById(userId);
        if (!account)
            throw new Error('Account not found');
        const passwordValid = await bcrypt.compare(currentPassword, account.password);
        if (!passwordValid)
            throw new Error('Current password is incorrect');
        account.password = await bcrypt.hash(newPassword, 10);
        await this.accountRepo.save(account);
    }
    async forgetPasswordRequest(email) {
        const account = await this.accountRepo.findByEmail(email);
        if (!account) {
            return;
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        this.forgetPasswordOtpStore.set(email, otp);
        await this.sendOtpEmail(email, otp);
        return otp;
    }
    async verifyForgetPasswordOtp(email, otp) {
        await Promise.resolve();
        const storedOtp = this.forgetPasswordOtpStore.get(email);
        if (!storedOtp) {
            throw new Error('No OTP request found for this email');
        }
        if (storedOtp !== otp) {
            throw new Error('Invalid OTP');
        }
    }
    async resetPassword(email, newPassword) {
        const account = await this.accountRepo.findByEmail(email);
        if (!account) {
            throw new Error('Account not found');
        }
        if (!this.forgetPasswordOtpStore.has(email)) {
            throw new Error('OTP verification required before resetting password');
        }
        account.password = await bcrypt.hash(newPassword, 10);
        await this.accountRepo.save(account);
        this.forgetPasswordOtpStore.delete(email);
    }
};
exports.AccountService = AccountService;
exports.AccountService = AccountService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [msPackage_repository_1.MsPackageRepository,
        ms_purchase_service_1.MsPurchaseService,
        account_repository_1.AccountRepository,
        user_repository_1.UserRepository,
        email_service_1.EmailService,
        jwt_1.JwtService])
], AccountService);
//# sourceMappingURL=account.service.js.map