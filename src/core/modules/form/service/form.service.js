import { FormRepository } from '../repository/form.repository';
import { UserRepository } from '../../user/repository/user.repository';
import { GroupRepository } from '../../group/repository/group.repository';
import { ActivityRepository } from '../../activity/repository/activity.repository';
import { NotFoundException } from '../../../../packages/httpException';
import { Optional } from '../../../utils/optional';
import { MemberGroupValidator } from '../../group/validator/memberGroup.validator';
import { FormDataService } from './formDataService';
import { logger } from '../../logger/winston';

class Service {
    constructor() {
        this.formRepository = FormRepository;
        this.userRepository = UserRepository;
        this.groupRepository = GroupRepository;
        this.activityRepository = ActivityRepository;
        this.logger = logger;
    }

    async createOne(data) {
        let createdForm;
        Optional
            .of(await this.userRepository.findById(data.userId))
            .throwIfNotPresent(new NotFoundException('User not found'));
        Optional
            .of(await this.groupRepository.findById(data.timetables.groupId))
            .throwIfNullable(new NotFoundException('Group not found'))
            .throwIfNotPresent(new NotFoundException('Group has been deleted'));
        Optional
            .of(await this.activityRepository.findWithActiveByIds(data.timetables.activities))
            .throwIfNullable(new NotFoundException('Some activities not found'));
        await new MemberGroupValidator(FormDataService.mappingUserIdForValidating(data.timetables)).validate();

        try {
            createdForm = await this.formRepository.create(data);
        } catch (error) {
            this.logger.error(error.message);
        }
        return { _id: createdForm._id };

        /** {
    "userId": "60c1027f7dad4d05d8440de7",
    "reason": " thick thi nghi",
    "type": "nghi",
    "attachment": "deo co",
    "timetables": [
        {
            "userId": "60c1027f7dad4d05d8440de7",
            "groupId": "60c102807dad4d05d8440eb0",
            "registerTime": "2021-06-09T18:03:44.464+00:00",
            // "type":,
            "activities": [
                "609398e16b84f24d556d32c1",
                "609398e16b84f24d556d32d1"
            ],
            "startDate": "2021-06-05T08:03:01.770+00:00",
            "endDate": "2021-06-05T08:03:01.770+00:00",
            // "isApproved": false,
            "isActive": true
        }
    ],
    "isApproved": false
} */
    }

    async findAll() {
        return 0;
    }

    async findOne() {
        return 0;
    }

    async patchOne() {
        return 0;
    }

    async deleteOne() {
        return 0;
    }
}

export const FormService = new Service();
