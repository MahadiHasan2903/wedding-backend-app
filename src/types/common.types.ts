import { Request } from 'express';
import { UserRole } from 'src/users/enum/users.enum';

export interface AuthenticatedRequest extends Request {
  user: {
    userId: string;
    email: string;
    userRole: UserRole;
  };
}
