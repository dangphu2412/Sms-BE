import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { mapByKey } from 'core/utils';
import { TimetableRepository } from 'core/modules/timetable/repository';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { DuplicateException, NotFoundException } from '../../../../packages/httpException';
import { GroupRepository } from '../repository/group.repository';
import { Optional } from '../../../utils/optional';
import { CreateGroupValidator } from '../validator/createGroup.validator';
import { GroupDataService } from './groupData.service';

class Service extends DataPersistenceService {
    constructor() {
        super(GroupRepository);
        this.logger = LoggerFactory.create('GroupService');
        this.groupDataService = GroupDataService;
        this.timetableRepository = TimetableRepository;
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

    async findChildren(id) {
        Optional
            .of(await this.repository.findById(id))
            .throwIfNotPresent(new NotFoundException('Group not found'));

        const childrenGroups = await this.repository.getChildrendById(id).lean();
        const childrenGroupIds = mapByKey(childrenGroups.children, '_id');
        const childTimetables = await this.timetableRepository.getManybyGroupIds(childrenGroupIds, ['groupId', 'registerTime']);

        childrenGroups.children = childrenGroups.children.map(child => {
            child.timetable = [];
            childTimetables.forEach(childTimetable => {
                if (child._id.equals(childTimetable.groupId)) {
                    child.timetable.push({ _id: childTimetable._id, registerTime: childTimetable.registerTime });
                }
            });
            return child;
        });

        return childrenGroups;
    }

    async deleteMember(id, deleteMembers) {
        Optional
            .of(await this.repository.getGeneralById(id))
            .throwIfNullable(new NotFoundException('Group not found!'));
        return this.repository.deleteMember(id, deleteMembers);
    }

    async patchOne(id, data) {
        Optional
            .of(await this.repository.findById(id))
            .throwIfNullable(new NotFoundException('Group Not Found'))
            .throwIfNotPresent(new NotFoundException('Group Has Been Deleted'));

        if (data.name) {
            Optional
                .of(await this.repository.findByName(data.name, '_id deletedAt'))
                .throwIfPresent(new DuplicateException(`Group ${data.name} is already existed`));
        }
        const group = await GroupRepository.getGeneralById(id);
        const dto = await this.groupDataService.mapUpdatingToModel(group, data);

        if (Object.keys(dto).length <= 0) { return null; }

        return this.repository.updateById(id, dto);
    }

    #updateChildInParent = async (groupId, parentId) => {
        const parentGroup = await this.repository.findById(parentId, '_id children');

        parentGroup.children.push(groupId);

        return parentGroup.save();
    }
}

export const GroupService = new Service();
