import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { TimetableSettingRepository } from 'core/modules/timetableSetting/repository';
import { TempTimetableRepository } from 'core/modules/temp_timetables/repository/temp_timetable.repository';
import { TIMETABLE_REQUEST_TYPE } from 'core/common/enum/timetableRequest.enum';
import { isEqualArray, mapParsedObjectIdToArr, mapObjectToArrByKey } from 'core/utils/helper';
import { TimetableRepository } from 'core/modules/timetable/repository';
import { BadRequestException, NotFoundException } from 'packages/httpException';
import { Optional } from 'core/utils/optional';
import { UserRepository } from 'core/modules/user/repository/user.repository';
import { GroupRepository } from 'core/modules/group/repository/group.repository';
import { LoggerFactory } from 'packages/logger';
import { TimetableRequestRepository } from '../repository/timetableRequest.repository';
import { TimetableRequestDataService } from './timetableRequestDataService';

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
                data.tempTimetables = await this.#getTemptableIds(data.tempTimetables);
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT_ADD: {
                const userIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');
                const registerTimeIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'registerTime'), 'registerTime');

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

                data.tempTimetables = await this.#getTemptableIds(data.tempTimetables);
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ABSENT: {
                const userIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                data.tempTimetables = await this.#getTemptableIds(data.tempTimetables);
                break;
            }
            case TIMETABLE_REQUEST_TYPE.LATE: {
                const userIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                data.tempTimetables = await this.#getTemptableIds(data.tempTimetables);
                break;
            }
            case TIMETABLE_REQUEST_TYPE.SOON: {
                const userIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');

                if (!isEqualArray(mapParsedObjectIdToArr(data.tempTimetables, 'userId'), userIdsFromTimetable)) {
                    throw new BadRequestException('Some timetableId is not belong to some userId');
                }
                data.tempTimetables = await this.#getTemptableIds(data.tempTimetables);
                break;
            }
            case TIMETABLE_REQUEST_TYPE.ADD: {
                const userIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'userId'), 'userId');
                const registerTimeIdsFromTimetable = mapParsedObjectIdToArr(await this.timetableRepository.findByIds(validatingData.timetableIds, 'registerTime'), 'registerTime');

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
                data.tempTimetables = await this.#getTemptableIds(data.tempTimetables);
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
        return mapObjectToArrByKey(createdTempTimetable, '_id');
    }
}

export const TimetableRequestService = new Service();
