import { toObjectId } from '../mongoose/utils/objectId.utils';

/**
 * @param {import('.').ICreateGroupTimetableDto | import('.').ICreateGroupTimetableDto} dto
 * @return {import('./timetable.model').ITimetableModel}
 */
export function mapToModel(dto) {
    const model = {};
    model.activities = [toObjectId(dto.activityId)];
    model.startDate = dto.startDate;
    model.endDate = dto.endDate;
    model.isActive = dto.isActive;
    model.group = null;
    model.user = null;
    return model;
}
