import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { TimetableSettingRepository } from 'core/modules/timetable-setting';
import { TempTimetableRepository } from 'core/modules/temp-timetables';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetable-request.enum';
import { isEqualArray, mapParsedObjectIdToArr, mapByKey } from 'core/utils/helper.util';
import { TimetableRepository } from 'core/modules/timetable';
import { BadRequestException, NotFoundException } from 'packages/httpException';
import { Optional } from 'core/utils/optional.util';
import { UserRepository } from 'core/modules/user/user.repository';
import { GroupRepository } from 'core/modules/group/group.repository';
import { LoggerFactory } from 'packages/logger';
import { TimetableRequestDataService } from './timetableRequestDataService';
import { TimetableRequestRepository } from '../timetable-request.repository';

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
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD: {
                const userIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'user'), 'user');
                const registerTimeIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'registerTime'), 'registerTime');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }

                Optional
                    .of(await this.timetableSettingRepository.findByIds(validatingData.registerTimeIds))
                    .throwIfMissingValues(validatingData.registerTimeIds, new NotFoundException('Some timetableSettingId not found or have been deleted'));

                registerTimeIdsFromTimetable.forEach(registerTimeId => {
                    if (mapParsedObjectIdToArr(data.tempTimetables, 'registerTime').some(val => val.equals(registerTimeId))) {
                        throw new BadRequestException('lên bù date must not be as same as main timetable');
                    }
                });

                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT: {
                const userIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                break;
            }
            case TIMETABLE_REQUEST_TYPE.LATE: {
                const userIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                break;
            }
            case TIMETABLE_REQUEST_TYPE.SOON: {
                const userIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ADD: {
                const userIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');
                const registerTimeIdsFromTimetable = mapByKey(await this.timetableRepository.findByIds(validatingData.timetableIds, 'registerTime'), 'registerTime');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }

                Optional
                    .of(await this.timetableSettingRepository.findByIds(validatingData.registerTimeIds))
                    .throwIfMissingValues(validatingData.registerTimeIds, new NotFoundException('Some timetableSettingId not found or have been deleted'));

                registerTimeIdsFromTimetable.forEach(registerTimeId => {
                    if (mapParsedObjectIdToArr(data.tempTimetables, 'registerTime').some(val => val.equals(registerTimeId))) {
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

    getByType = async (type, approvalStatus) => {
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

        return TimetableRequestRepository.findByType(queryFields, type, approvalStatus);
    }

    #getTemptableIds = async tempTimetable => {
        const createdTempTimetable = await this.tempTimetableRepository.model.create(tempTimetable);
        return mapByKey(createdTempTimetable, '_id');
    }
}

export const TimetableRequestService = new Service();
