import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { FormRepository } from '../repository/form.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { GroupRepository } from '../../group/repository/group.repository';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { NotFoundException } from '../../../../packages/httpException';
import { Optional } from '../../../utils/optional';
import { FormDataService } from './formDataService';
import { logger } from '../../logger/winston';

class Service extends DataPersistenceService {
    constructor() {
        super(FormRepository);
        this.userRepository = UserRepository;
        this.groupRepository = GroupRepository;
        this.activityRepository = ActivityRepository;
        this.logger = logger;
    }

    async createOne(data) {
        let createdForm;
        const validatingData = FormDataService.mappingForValidating(data.timetables);

        Optional
            .of(await this.userRepository.findById(data.userId))
            .throwIfNotPresent(new NotFoundException('User not found'));
        Optional
            .of(await this.userRepository.findByIds(validatingData.userIds))
            .throwIfMissingValues(validatingData.userIds, new NotFoundException('Some users not found or have been deleted'));
        Optional
            .of(await this.groupRepository.findByIds(validatingData.groupIds))
            .throwIfMissingValues(validatingData.groupIds, new NotFoundException('Some groups not found or have been deleted'));
        Optional
            .of(await this.activityRepository.findWithActiveByIds(validatingData.activities))
            .throwIfMissingValues(validatingData.activities, new NotFoundException('Some activities not found or have been deleted'));

        try {
            createdForm = await this.repository.model.create(data);
        } catch (error) {
            this.logger.error(error.message);
        }
        return { _id: createdForm._id };
    }
}

export const FormService = new Service();