import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetable-request.enum';

class Service {
    mappingForValidating(data, type) {
        const dto = {
            userIds: [],
            timetableIds: [],
            groupIds: [],
            registerTimeIds: [],
        };
        dto.userIds = data.map(tempTimetable => tempTimetable.userId);
        data.forEach(tempTimetable => {
            if (tempTimetable.groupId) dto.groupIds.push(tempTimetable.groupId);
        });

        switch (type) {
            case TIMETABLE_REQUEST_TYPE.OUT:
                break;
            case TIMETABLE_REQUEST_TYPE.ABSENT:
            case TIMETABLE_REQUEST_TYPE.SOON:
            case TIMETABLE_REQUEST_TYPE.LATE:
                dto.timetableIds = data.map(tempTimetable => tempTimetable.timetable);
                break;
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD:
            case TIMETABLE_REQUEST_TYPE.ADD:
                dto.timetableIds = data.map(tempTimetable => tempTimetable.timetable);
                dto.registerTimeIds = data.map(tempTimetable => tempTimetable.registerTime);
                break;
        }
        return dto;
    }
}

export const TimetableRequestDataService = new Service();
