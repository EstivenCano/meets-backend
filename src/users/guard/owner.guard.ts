import { JwtPayload } from '../../auth/types';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class IsOwner implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const id = params.id;
    const user = request.user as JwtPayload;

    if (!id) return false;

    if (!user) return false;

    return user.sub === Number(id);
  }
}
