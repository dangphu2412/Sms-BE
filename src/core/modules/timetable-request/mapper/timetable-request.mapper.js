export function mapToModelByTimetableRequestCreationDto(timetableRequestCreationDto) {
    return {
        user: timetableRequestCreationDto.userId,
        type: timetableRequestCreationDto.type,
        description: timetableRequestCreationDto.description,
        attachment: timetableRequestCreationDto.attachment,
        tempTimetables: timetableRequestCreationDto.tempTimetables.map(tempTimetable => {
            tempTimetable['timetable'] = tempTimetable['timetableId'];
            tempTimetable['registerTime'] = tempTimetable['registerTimeId'];
            delete tempTimetable['timetableId'];
            delete tempTimetable['registerTimeId'];
            return tempTimetable;
        }),
        isApproved: timetableRequestCreationDto.isApproved,
    };
}
