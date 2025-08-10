import { AccountRepository } from './repositories/account.repository';
import { CreateAccountDto } from './dto/create-account.dto';
import { EmailService } from '../common/email/email.service';
import { JwtService } from '@nestjs/jwt';
import { AccountStatus } from 'src/users/enum/users.enum';
import { User } from 'src/users/entities/user.entity';
import { MsPackageRepository } from 'src/ms-package/repositories/msPackage.repository';
import { MsPurchaseService } from 'src/ms-purchase/ms-purchase.service';
import { UserRepository } from 'src/users/repositories/user.repository';
export declare class AccountService {
    private readonly msPackageRepo;
    private readonly msPurchaseService;
    private readonly accountRepo;
    private readonly usersRepository;
    private readonly emailService;
    private readonly jwtService;
    private otpStore;
    private forgetPasswordOtpStore;
    constructor(msPackageRepo: MsPackageRepository, msPurchaseService: MsPurchaseService, accountRepo: AccountRepository, usersRepository: UserRepository, emailService: EmailService, jwtService: JwtService);
    findByEmailOrPhone(email: string, phone?: string): Promise<User | null>;
    create(createAccountDto: CreateAccountDto): Promise<{
        message: string;
        otp?: string;
    }>;
    private sendOtpEmail;
    verifyOtp(email: string, otp: string): Promise<User>;
    signin(email: string, password: string): Promise<{
        user: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            phoneNumber: string | null;
            userRole: import("src/users/enum/users.enum").UserRole;
            accountStatus: AccountStatus.ACTIVE | AccountStatus.BANNED;
            profilePicture: import("../media/entities/media.entity").Media | null;
            purchasedMembership: import("../users/types/user-ms-purchase.types").PurchasedMembershipInfo | null;
        };
        accessToken: string;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    forgetPasswordRequest(email: string): Promise<string | undefined>;
    verifyForgetPasswordOtp(email: string, otp: string): Promise<void>;
    resetPassword(email: string, newPassword: string): Promise<void>;
}
