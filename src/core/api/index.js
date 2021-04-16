import { HandlerResolver } from '../../packages/handler/HandlerResolver';
import { PermissionResolver } from './permission/resolver/permission.resolver';
import { RoleResolver } from './role/resolver/role.resolver';
import { UserResolver } from './user/resolver/user.resolver';
import { AuthResolver } from './auth/resolver/auth.resolver';
import { ApiDocument } from '../config/swagger';

export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([UserResolver, RoleResolver, PermissionResolver, AuthResolver])
    .resolve();
