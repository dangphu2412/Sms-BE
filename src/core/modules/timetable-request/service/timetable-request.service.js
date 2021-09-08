import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { TimetableSettingRepository } from 'core/modules/timetable-setting';
import { TempTimetableRepository } from 'core/modules/temp-timetables';
import { APPROVAL_STATUS, TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetable-request.enum';
import { TimetableRepository } from 'core/modules/timetable';
import { UserRepository } from 'core/modules/user/user.repository';
import { GroupRepository } from 'core/modules/group/group.repository';
import { LoggerFactory } from 'packages/logger';
import { InternalServerException, NotFoundException } from 'packages/httpException';
import { Optional, mapByKey, removeByKey } from 'core/utils';
import { TimetableRequestRepository } from '../timetable-request.repository';
import { TimetableRequestCreationValidator } from '../validator/create-timetable-request.validator';
import { mapToModelByTimetableRequestCreationDto } from '../mapper';
import { ApproveTimetableRequestValidator, RejectTimetableRequestValidator } from '../validator';

class TimetableRequestServiceImpl extends DataPersistenceService {
    constructor() {
        super(TimetableRequestRepository);
        this.userRepository = UserRepository;
        this.groupRepository = GroupRepository;
        this.timetableSettingRepository = TimetableSettingRepository;
        this.tempTimetableRepository = TempTimetableRepository;
        this.timetableRepository = TimetableRepository;
        this.logger = LoggerFactory.create(TimetableRequestServiceImpl.name);
    }

    async createOne(TimetableRequestDto) {
        await new TimetableRequestCreationValidator(TimetableRequestDto).validate();

        const mappedTimetableRequestToModel = mapToModelByTimetableRequestCreationDto(TimetableRequestDto);
        const createdTimetableRequest = await this.createOneSafety(mappedTimetableRequestToModel, () => new InternalServerException('Getting internal error when creating new timetable request'));
        return { _id: createdTimetableRequest._id };
    }

    async approveOneTimetableRequest(id, userId) {
        const timetableRequest = Optional
            .of(await this.repository.model.findById(id).lean())
            .throwIfNotPresent(new NotFoundException('Timetable request not found'))
            .get();

        await new ApproveTimetableRequestValidator({ approvalStatus: timetableRequest.approvalStatus, userId }).validate();

        switch (timetableRequest.type) {
            case TIMETABLE_REQUEST_TYPE.OUT: {
                /** 
                     * IMPLEMENT IN THE FUTURE
                     */
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD:
            case TIMETABLE_REQUEST_TYPE.ABSENT:
            case TIMETABLE_REQUEST_TYPE.LATE:
            case TIMETABLE_REQUEST_TYPE.SOON:
            case TIMETABLE_REQUEST_TYPE.ADD:
                await this.tempTimetableRepository.model.insertMany(removeByKey(timetableRequest.tempTimetables, ['deletedAt', 'createdAt', 'updatedAt']));
                return this.repository.updateById(id, { approvalStatus: APPROVAL_STATUS.APPROVED, updatedBy: userId });
        }
    }

    async rejectOneTimetableRequest(id, userId) {
        const timetableRequest = Optional
            .of(await this.repository.model.findById(id).lean())
            .throwIfNotPresent(new NotFoundException('Timetable request not found'))
            .get();

        await new RejectTimetableRequestValidator({ approvalStatus: timetableRequest.approvalStatus, userId }).validate();

        if (timetableRequest.approvalStatus === APPROVAL_STATUS.APPROVED) {
            const tempTimetableIds = mapByKey(timetableRequest.tempTimetables, '_id');
            await this.tempTimetableRepository.deleteMany({ _id: { $in: tempTimetableIds } });
        }
        return this.repository.updateById(id, { approvalStatus: APPROVAL_STATUS.REJECTED, updatedBy: userId });
    }

    getTimetableRequestByType = async (type, approvalStatus) => {
        const queryFields = {
            timetableRequest: {
                select: []
            },
            tempTimetable: {
                path: 'tempTimetables',
                match: { deletedAt: { $eq: null } },
            }
        };

        switch (type) {
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD:
            {
                queryFields.tempTimetable.select = '_id';
                queryFields.tempTimetable.populate = {
                    path: 'registerTime',
                    match: { deletedAt: { $eq: null } },
                    select: '_id name startTime endTime dayOfWeek'
                };
                break;
            }
            case TIMETABLE_REQUEST_TYPE.LATE:
            {
                queryFields.timetableRequest.select = ['description'];

                queryFields.tempTimetable.select = '_id customStartTime';
                queryFields.tempTimetable.populate = {
                    path: 'timetable',
                    match: { deletedAt: { $eq: null } },
                    select: '_id startDate endDate'
                };
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT:
            {
                queryFields.timetableRequest.select = ['description'];

                queryFields.tempTimetable.select = '_id';
                queryFields.tempTimetable.populate = {
                    path: 'timetable',
                    match: { deletedAt: { $eq: null } },
                    select: '_id startDate endDate'
                };
                break;
            }
            default:
            {
                queryFields.timetableRequest.select = ['description', 'type'];

                queryFields.tempTimetable.select = '_id customStartTime';
                queryFields.tempTimetable.populate = [
                    {
                        path: 'registerTime',
                        match: { deletedAt: { $eq: null } },
                        select: '_id name startTime endTime dayOfWeek'
                    },
                    {
                        path: 'timetable',
                        match: { deletedAt: { $eq: null } },
                        select: '_id startDate endDate'
                    }
                ];
            }
        }
        return TimetableRequestRepository.findByType(queryFields, type, approvalStatus);
    }
}

export const TimetableRequestService = new TimetableRequestServiceImpl();
