import { HandlerResolver } from 'packages/handler/HandlerResolver';
import { UserResolver } from './user';
import { GroupResolver } from './group';
import { AuthResolver } from './auth';
import { ApiDocument } from '../config/swagger.config';
import { TimetableSettingResolver } from './timetable-setting';
import { TimetableResolver } from './timetable';
import { ExcelResolver } from './excel';
import { MediaResolver } from './media';
import { GroupTagResolver } from './group-tag';
import { TimetableRequestResolver } from './timetable-request';
import { ActivityResolver } from './activity';

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
        TimetableRequestResolver,
        ActivityResolver
    ]);
