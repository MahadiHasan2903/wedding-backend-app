import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedRequest } from 'src/types/common.types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthenticatedRequest => {
    const request = ctx.switchToHttp().getRequest<Request>();
    return request.user as AuthenticatedRequest;
  },
);
