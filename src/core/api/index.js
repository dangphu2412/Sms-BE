import { HandlerResolver } from '../../packages/handler/HandlerResolver';
import { UserResolver } from './user/resolver/user.resolver';
import { GroupResolver } from './group/resolver/group.resolver';
import { AuthResolver } from './auth/resolver/auth.resolver';
import { TimetableSettingResolver } from './timetableSetting/resolver/timetableSetting.resolver';
import { ApiDocument } from '../config/swagger';
import { TimetableResolver } from './timetable/resolver/timetable.resolver';

export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([UserResolver, AuthResolver,GroupResolver, TimetableSettingResolver, TimetableResolver]);
