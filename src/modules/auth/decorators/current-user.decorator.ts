import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserPayload } from '../interfaces/user-payload.interface';

interface RequestWithUser extends Request {
  user: UserPayload;
}

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);
