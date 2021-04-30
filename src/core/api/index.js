import { HandlerResolver } from '../../packages/handler/HandlerResolver';
import { UserResolver } from './user/resolver/user.resolver';
import { AuthResolver } from './auth/resolver/auth.resolver';
import { TimetableSettingResolver } from './timetableSetting/resolver/timetableSetting.resolver';
import { ApiDocument } from '../config/swagger';

export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([UserResolver, AuthResolver, TimetableSettingResolver])
    .resolve();
