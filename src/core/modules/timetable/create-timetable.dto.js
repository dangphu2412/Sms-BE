import { ApiDocument } from 'core/config/swagger.config';
import { SwaggerDocument } from 'packages/swagger';

/**
 * @typedef ICreateMemberTimetableDto
 * @property {string} userId
 * @property {string} registerTimeId
 * @property {string} activityId
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {boolean} isActive
 */

/**
 * @typedef ICreateGroupTimetableDto
 * @property {string} groupId
 * @property {string} registerTimeId
 * @property {string} activityId
 * @property {Date} startDate
 * @property {Date} endDate
 * @property {boolean} isActive
 */

ApiDocument.addModel('CreateMemberTimetableDtos', {
    userId: SwaggerDocument.ApiProperty({ type: 'string' }),
    registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
    activityId: SwaggerDocument.ApiProperty({ type: 'string' }),
    startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' })
}, true);

ApiDocument.addModel('CreateGroupTimetableDtos', {
    groupId: SwaggerDocument.ApiProperty({ type: 'string' }),
    registerTimeId: SwaggerDocument.ApiProperty({ type: 'string' }),
    activityId: SwaggerDocument.ApiProperty({ type: 'string' }),
    startDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    endDate: SwaggerDocument.ApiProperty({ type: 'dateTime' }),
    isActive: SwaggerDocument.ApiProperty({ type: 'bool' })
}, true);

export const CreateMemberTimetableDtos = body => body.map(({
    userId,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive
}) => ({
    userId,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive
}));

export const CreateGroupTimetableDtos = body => body.map(({
    groupId,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive
}) => ({
    groupId,
    registerTimeId,
    activityId,
    startDate,
    endDate,
    isActive
}));
