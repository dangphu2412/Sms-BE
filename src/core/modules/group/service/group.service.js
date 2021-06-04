import { GroupFetchCase } from 'core/common/enum/groupFetchCase';
import { DuplicateException, BadRequestException, NotFoundException } from '../../../../packages/httpException';
import { GroupRepository } from '../repository/group.repository';
import { logger } from '../../logger/winston';
import { Optional } from '../../../utils/optional';
import { CreateGroupValidator } from '../validator/createGroup.validator';
import { GroupDataService } from './groupData.service';

class Service {
    constructor() {
        this.logger = logger;
        this.groupDataService = GroupDataService;
        this.groupRepository = GroupRepository;
    }

    async createOne(groupDto) {
        let createdGroup;

        Optional
            .of(await this.groupRepository.findByName(groupDto.name, '_id deletedAt'))
            .throwIfPresent(new DuplicateException(`Group ${groupDto.name} is already existed`));

        await new CreateGroupValidator(groupDto).validate();

        try {
            createdGroup = await this.groupRepository.create(
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

    async findAll(reqTransformed) {
        const findBuilder = this.groupRepository.model.find();
        const countBuilder = this.groupRepository.model.find();
        const filterDocument = {};
        const sortDocument = {};

        reqTransformed.filters.forEach(filter => {
            if (!filterDocument[filter.column]) {
                filterDocument[filter.column] = {};
            }

            filterDocument[filter.column][filter.sign] = filter.value;
        });

        reqTransformed.sorts.forEach(sortItem => {
            sortDocument[sortItem.sort] = sortItem.order;
        });

        if (reqTransformed.search) {
            const searchObj = {
                $or: []
            };

            const searchRegex = {
                $regex: reqTransformed.search.value, $options: 'i'
            };
            reqTransformed.search.criteria.forEach(searchField => {
                const obj = {};
                obj[searchField] = searchRegex;
                searchObj['$or'].push(obj);
            });
            findBuilder.find(searchObj);
            countBuilder.find(searchObj);
        }

        findBuilder.find(filterDocument);
        findBuilder.sort(sortDocument);

        countBuilder.find(filterDocument);
        countBuilder.sort(sortDocument);
        const groups = findBuilder
            .limit(reqTransformed.pagination.size)
            .skip(reqTransformed.pagination.offset);

        const count = countBuilder.countDocuments();
        return Promise.all([
            groups,
            count
        ]);
    }

    async findOne(id, type) {
        switch (type) {
        case GroupFetchCase.GENERAL:
            return this.groupRepository.getGeneralById(id);
        case GroupFetchCase.DETAIL:
            return this.groupRepository.getDetailById(id);
        default:
            throw new BadRequestException('Unsupported type');
        }
    }

    async deleteMember(id, deleteMembers) {
        Optional
            .of(await this.groupRepository.getGeneralById(id))
            .throwIfNullable(new NotFoundException('Group not found!'));
        return this.groupRepository.deleteMember(id, deleteMembers);
    }

    #updateChildInParent = async (groupId, parentId) => {
        const parentGroup = await this.groupRepository.findById(parentId, '_id childs');

        parentGroup.childs.push(groupId);

        return parentGroup.save();
    }
}

export const GroupService = new Service();
