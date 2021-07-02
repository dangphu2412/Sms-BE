import { uniq, flattenDeep, concat } from 'lodash';

class Service {
    mappingForValidating(data) {
        const dto = {
            userIds: [],
            groupIds: [],
            activities: []
        };
        dto.userIds = data.map(userIds => userIds.userId);
        dto.groupIds = data.map(groupIds => groupIds.groupId);
        dto.activities = uniq(
            flattenDeep(
                concat(
                    dto.activities, data.map(activitiesArrs => activitiesArrs.activities)
                )
            )
        );
        return dto;
    }
}

export const TimetableRequestDataService = new Service();
