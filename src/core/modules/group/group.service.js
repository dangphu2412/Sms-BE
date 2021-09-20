import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler';
import { mapByKey, Optional } from 'core/utils';
import { TimetableRepository } from 'core/modules/timetable';
import { LoggerFactory } from 'packages/logger';
import { DuplicateException, InternalServerException, NotFoundException } from 'packages/httpException';
import { GroupRepository } from './group.repository';
import { GroupCreationValidator, GroupModificationValidator } from './validator';
import { mapToModelByGroupCreationDto, mapToModelByGroupModificationDto } from './mapper';

class GroupServiceImpl extends DataPersistenceService {
    constructor() {
        super(GroupRepository);
        this.logger = LoggerFactory.create(GroupServiceImpl.name);
        this.timetableRepository = TimetableRepository;
    }

    /**
     * @param {import('./dto/createGroup.dto').ICreateGroupDto} groupCreationDto
     * @returns {Promise<{_id: string}>}
     */
    async createOne(groupCreationDto) {
        Optional
            .of(await this.repository.getByName(groupCreationDto.name, '_id deletedAt'))
            .throwIfPresent(new DuplicateException(`Group ${groupCreationDto.name} is already existed`));

        await new GroupCreationValidator(groupCreationDto).validate();

        const createdGroup = await this.createOneSafety(
            mapToModelByGroupCreationDto(groupCreationDto),
            () => new InternalServerException('Getting internal error when creating new group')
        );

        if (groupCreationDto.parentId) {
            await this.#updateChildInParent(createdGroup._id, groupCreationDto.parentId);
        }

        return { _id: createdGroup._id };
    }

    async findChildren(id) {
        Optional
            .of(await this.repository.findById(id))
            .throwIfNotPresent(new NotFoundException('Group not found'));

        const childrenGroups = await this.repository.getWithChildrenById(id).lean();
        const childrenGroupIds = mapByKey(childrenGroups.children, '_id');
        const childrenTimetables = await this.timetableRepository.getManyByGroupIds(childrenGroupIds, 'group  registerTime');

        this.#pickTimetablesToRightGroups(childrenGroups, childrenTimetables);

        return childrenGroups;
    }

    /**
     * @param {import('./dto/updateGroup.dto').IUpdateGroupDto} updateGroupDto
     * @returns {Promise<void>}
     */
    async patchOne(id, updateGroupDto) {
        const group = Optional
            .of(await this.repository.findById(id))
            .throwIfNullable(new NotFoundException(`Can not find group with id ${id}`))
            .throwIfNotPresent(new NotFoundException(`Group with id ${id} has been deleted`))
            .get();

        await new GroupModificationValidator(updateGroupDto).validate();

        await super.patchOne(id, group, mapToModelByGroupModificationDto(updateGroupDto));
    }

    #updateChildInParent = async (groupId, parentId) => {
        const parentGroup = await this.repository.findById(parentId, '_id children');

        parentGroup.children.push(groupId);

        try {
            await parentGroup.save();
        } catch (error) {
            this.logger.error(error.message);
            this.logger.error(error.stack);
        }
    }

    /**
     * @param {[]} sourceTimetables
     * @param {[]} targetGroups
     */
    #pickTimetablesToRightGroups = (sourceTimetables, targetGroups) => {
        const timetableMapChildren = {};

        sourceTimetables.forEach(childrenTimetable => {
            if (!timetableMapChildren[childrenTimetable.group]) {
                timetableMapChildren[childrenTimetable.group] = [];
            }

            timetableMapChildren[childrenTimetable.group].push({
                _id: childrenTimetable._id,
                registerTime: childrenTimetable.registerTime
            });
        });

        targetGroups.children = targetGroups.children.map(childrenGroup => {
            childrenGroup.timetables = timetableMapChildren[childrenGroup._id];
            return childrenGroup;
        });
    }
}

export const GroupService = new GroupServiceImpl();
