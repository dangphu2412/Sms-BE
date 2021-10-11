/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
import { TempTimetableModel } from 'core/modules/temp-timetables';
import { TimetableRequestRepository } from 'core/modules/timetable-request';

export class TempTimetableSeed {
    static async run() {
        const timetableRequests = await TimetableRequestRepository.model.find({ approvalStatus: 'APPROVED' }, ['tempTimetables']).lean();
        const sampleTempTimetableData = timetableRequests.reduce((totalTempTimetables, eachTimetableRequests) => totalTempTimetables.concat(eachTimetableRequests.tempTimetables), []);
        await TempTimetableModel.insertMany(sampleTempTimetableData);
    }
}
