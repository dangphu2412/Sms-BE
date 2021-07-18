import { HandlerResolver } from '../../packages/handler/HandlerResolver';
import { UserResolver } from './user/resolver/user.resolver';
import { GroupResolver } from './group/resolver/group.resolver';
import { AuthResolver } from './auth/resolver/auth.resolver';
import { TimetableSettingResolver } from './timetableSetting/resolver/timetableSetting.resolver';
import { ExcelResolver } from './excel/resolver/excel.resolver';
import { ApiDocument } from '../config/swagger';
import { TimetableResolver } from './timetable/resolver/timetable.resolver';
import { MediaResolver } from './media/resolver/media.resolver';
import { GroupTagResolver } from './groupTag/resolver/groupTag.resolver';
import { TimetableRequestResolver } from './timetable_requests/resolver/timetableRequest.resolver';

export const ModuleResolver = HandlerResolver
    .builder()
    .addSwaggerBuilder(ApiDocument)
    .addModule([
        UserResolver,
        AuthResolver,
        GroupResolver,
        TimetableSettingResolver,
        TimetableResolver,
        ExcelResolver,
        MediaResolver,
        GroupTagResolver,
        TimetableRequestResolver
    ]);
