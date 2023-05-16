import { JwtPayload } from '../../auth/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsOn implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const body = request.body;
    const ids = body.userIds as Array<number>;
    const user = request.user as JwtPayload;

    if (!ids) return false;

    if (!user) return false;

    return ids.some((id) => id === user.sub);
  }
}
