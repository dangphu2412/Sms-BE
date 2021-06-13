import { GroupFetchCase } from 'core/common/enum/groupFetchCase';
import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { DuplicateException, BadRequestException, NotFoundException } from '../../../../packages/httpException';
import { GroupRepository } from '../repository/group.repository';
import { logger } from '../../logger/winston';
import { Optional } from '../../../utils/optional';
import { CreateGroupValidator } from '../validator/createGroup.validator';
import { GroupDataService } from './groupData.service';

class Service extends DataPersistenceService {
    constructor() {
        super(GroupRepository);
        this.logger = logger;
        this.groupDataService = GroupDataService;
    }

    async createOne(groupDto) {
        let createdGroup;

        Optional
            .of(await this.repository.findByName(groupDto.name, '_id deletedAt'))
            .throwIfPresent(new DuplicateException(`Group ${groupDto.name} is already existed`));

        await new CreateGroupValidator(groupDto).validate();

        try {
            createdGroup = await this.repository.model.create(
                this.groupDataService.mapCreateDtoToModel(groupDto)
            );

            if (groupDto.parentId) {
                await this.#updateChildInParent(createdGroup._id, groupDto.parentId);
            }
        } catch (error) {
            this.logger.error(error.message);
        }
        return { _id: createdGroup._id };
    }

    async findOne(id, type) {
        switch (type) {
        case GroupFetchCase.GENERAL:
            return this.repository.getGeneralById(id);
        case GroupFetchCase.DETAIL:
            return this.repository.getDetailById(id);
        default:
            throw new BadRequestException('Unsupported type');
        }
    }

    async deleteMember(id, deleteMembers) {
        Optional
            .of(await this.repository.getGeneralById(id))
            .throwIfNullable(new NotFoundException('Group not found!'));
        return this.repository.deleteMember(id, deleteMembers);
    }

    #updateChildInParent = async (groupId, parentId) => {
        const parentGroup = await this.repository.findById(parentId, '_id childs');

        parentGroup.childs.push(groupId);

        return parentGroup.save();
    }
}

export const GroupService = new Service();
