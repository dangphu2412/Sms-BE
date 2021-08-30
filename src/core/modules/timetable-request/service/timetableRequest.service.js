import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { TimetableSettingRepository } from 'core/modules/timetable-setting';
import { TempTimetableRepository } from 'core/modules/temp-timetables';
import { TIMETABLE_REQUEST_TYPE, APPROVAL_STATUS } from 'core/common/enum/timetable-request.enum';
import {
    ArrayObjectUtils
} from 'core/utils';
import { TimetableRepository } from 'core/modules/timetable';
import { BadRequestException, NotFoundException } from 'packages/httpException';
import { Optional } from 'core/utils/optional.util';
import { UserRepository } from 'core/modules/user/user.repository';
import { GroupRepository } from 'core/modules/group/group.repository';
import { LoggerFactory } from 'packages/logger';
import { TimetableRequestDataService } from './timetableRequestDataService';
import { TimetableRequestRepository } from '../timetable-request.repository';
import { ApproveTimetableRequestValidator, RejectTimetableRequestValidator } from '../validator';

class Service extends DataPersistenceService {
    constructor() {
        super(TimetableRequestRepository);
        this.userRepository = UserRepository;
        this.groupRepository = GroupRepository;
        this.timetableSettingRepository = TimetableSettingRepository;
        this.tempTimetableRepository = TempTimetableRepository;
        this.dataService = TimetableRequestDataService;
        this.timetableRepository = TimetableRepository;
        this.logger = LoggerFactory.create('TimetableRequestService');
    }

    async createOne(data) {
        const validatingData = this.dataService.mappingForValidating(data.tempTimetables, data.type);
        let createdTimetableRequest;

        Optional
            .of(await this.userRepository.findById(data.userId))
            .throwIfNotPresent(new NotFoundException('User not found'));

        Optional
            .of(await this.userRepository.findByIds(validatingData.userIds))
            .throwIfMissingValues(validatingData.userIds, new NotFoundException('Some users not found or have been deleted'));

        if (validatingData.groupIds.length > 0) {
            Optional
                .of(await this.groupRepository.findByIds(validatingData.groupIds))
                .throwIfMissingValues(validatingData.groupIds, new NotFoundException('Some groups not found or have been deleted'));
        }
        if (validatingData.timetableIds.length > 0) {
            Optional
                .of(await this.timetableRepository.findByIds(validatingData.timetableIds))
                .throwIfMissingValues(validatingData.timetableIds, new NotFoundException('Some timetableId not found or have been deleted'));
        }
        switch (data.type) {
            case TIMETABLE_REQUEST_TYPE.OUT: {
                /** 
                 * IMPLEMENT IN THE FUTURE
                 */
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD: {
                const userIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');
                const registerTimeIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'registerTime'), 'registerTime');

                if (!ArrayObjectUtils.isEqualArray(ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }

                Optional
                    .of(await this.timetableSettingRepository.findByIds(validatingData.registerTimeIds))
                    .throwIfMissingValues(validatingData.registerTimeIds, new NotFoundException('Some timetableSettingId not found or have been deleted'));

                registerTimeIdsFromTimetable.forEach(registerTimeId => {
                    if (ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'registerTime').some(val => val.equals(registerTimeId))) {
                        throw new BadRequestException('lên bù date must not be as same as main timetable');
                    }
                });

                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT: {
                const userIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!ArrayObjectUtils.isEqualArray(ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                break;
            }
            case TIMETABLE_REQUEST_TYPE.LATE: {
                const userIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!ArrayObjectUtils.isEqualArray(ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                break;
            }
            case TIMETABLE_REQUEST_TYPE.SOON: {
                const userIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!ArrayObjectUtils.isEqualArray(ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ADD: {
                const userIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');
                const registerTimeIdsFromTimetable = ArrayObjectUtils.mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'registerTime'), 'registerTime');

                if (!ArrayObjectUtils.isEqualArray(ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }

                Optional
                    .of(await this.timetableSettingRepository.findByIds(validatingData.registerTimeIds))
                    .throwIfMissingValues(validatingData.registerTimeIds, new NotFoundException('Some timetableSettingId not found or have been deleted'));

                registerTimeIdsFromTimetable.forEach(registerTimeId => {
                    if (ArrayObjectUtils.mapParsedObjectIdToArr(data.tempTimetables, 'registerTime').some(val => val.equals(registerTimeId))) {
                        throw new BadRequestException('addition date must not be as same as main timetable');
                    }
                });
                break;
            }
        }

        try {
            createdTimetableRequest = await this.repository.model.create(data);
        } catch (error) {
            this.logger.error(error.message);
        }
        return { _id: createdTimetableRequest._id };
    }

    async getByType(type, approvalStatus) {
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
                    path: 'timetableId',
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
                    path: 'timetableId',
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
                        path: 'timetableId',
                        match: { deletedAt: { $eq: null } },
                        select: '_id startDate endDate'
                    }
                ];
            }
        }

        return this.repository.findByType(queryFields, type, approvalStatus);
    }

    async approveOne(id, userId) {
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
                await this.tempTimetableRepository.model.insertMany(ArrayObjectUtils.removeByKey(timetableRequest.tempTimetables, ['deletedAt', 'createdAt', 'updatedAt']));
                return this.repository.updateById(id, { approvalStatus: APPROVAL_STATUS.APPROVED, updatedBy: userId });
        }
    }

    async rejectOne(id, userId) {
        const timetableRequest = Optional
            .of(await this.repository.model.findById(id).lean())
            .throwIfNotPresent(new NotFoundException('Timetable request not found'))
            .get();

        await new RejectTimetableRequestValidator({ approvalStatus: timetableRequest.approvalStatus, userId }).validate();

        if (timetableRequest.approvalStatus === APPROVAL_STATUS.APPROVED) {
            const tempTimetableIds = ArrayObjectUtils.mapByKey(timetableRequest.tempTimetables, '_id');
            await this.tempTimetableRepository.deleteMany({ _id: { $in: tempTimetableIds } });
        }
        return this.repository.updateById(id, { approvalStatus: APPROVAL_STATUS.REJECTED, updatedBy: userId });
    }
}

export const TimetableRequestService = new Service();
