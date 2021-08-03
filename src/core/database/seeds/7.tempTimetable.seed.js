/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import { TempTimetableModel } from 'core/modules/temp_timetables/model/tempTimetableModel';
import { TimetableRequestRepository } from 'core/modules/timetable_request/repository/timetableRequest.repository';

export class TempTimetableSeed {
    static async run() {
        const timetableRequests = await TimetableRequestRepository.model.find({ approvalStatus: 'APPROVED' }, ['tempTimetables']).lean();
        const sampleTempTimetableData = timetableRequests.reduce((totalTempTimetables, eachTimetableRequests) => totalTempTimetables.concat(eachTimetableRequests.tempTimetables), []);
        await TempTimetableModel.insertMany(sampleTempTimetableData);
    }
}
