import { GroupFetchCase } from 'core/common/enum/groupFetchCase';
import { DataPersistenceService } from 'packages/restBuilder/core/dataHandler/data.persistence.service';
import { mapObjectToArrByKey } from 'core/utils';
import { TimetableRepository } from 'core/modules/timetable/repository';
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

    async findChildren(id) {
        Optional
            .of(await this.repository.findById(id))
            .throwIfNotPresent(new NotFoundException('Group not found'));

        const data = await this.repository.getChildrendById(id).lean();
        const childrenIds = mapObjectToArrByKey(data.children, '_id');
        const childTimetables = await TimetableRepository.getManybyGroupsWithSelectedFields(childrenIds, ['groupId', 'registerTime']);

        data.children = data.children.map(child => {
            child.timetable = [];
            childTimetables.forEach(childTimetable => {
                if (child._id.equals(childTimetable.groupId)) {
                    child.timetable.push({ timetableId: childTimetable._id, registerTime: childTimetable.registerTime });
                }
            });
            return child;
        });

        return data;
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
