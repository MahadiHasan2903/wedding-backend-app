import { Request } from 'express';
import { UserRole } from 'src/users/enum/users.enum';

export interface AuthenticatedUser {
  userId: number;
  email: string;
  userRole: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}
