/* eslint-disable max-len */
import { GroupModel } from '../model/groupModel';
import { DuplicateException, NotFoundException } from '../../../../packages/httpException';
import { GroupRepository } from '../repository/group.repository';
import { logger } from '../../logger/winston';

class Service {
    constructor() {
        this.logger = logger;
        this.groupRepository = GroupRepository;
    }

    async createOne(groupDto) {
        let insertedGroup;
        const existedGroup = await this.groupRepository.findGroupByName(groupDto.name);
        if (existedGroup.length > 0 && existedGroup[0].deletedAt == null) {
            throw new DuplicateException(`Group ${groupDto.name} is already existed`);
        }

        if (groupDto.childIds.length > 0) {
            const groupChilds = await this.groupRepository.findGroupById(groupDto.childIds);
            const checkGroupId = groupDto.childIds.map(groupId => groupChilds.some(group => `${group._id}` === groupId));
            /* checkGroupId return a mapping array of groupDto.childIds
            to show if groupId in groupDto.childIds is existed in groupChild.
            Ex: [false, true, false, false, false, true] */

            checkGroupId.forEach((isIdAvailable, index) => {
                if (!isIdAvailable) {
                    throw new NotFoundException(`group with ID: ${groupDto.childIds[index]} not found for childs`);
                }
            });
            groupChilds.forEach(async group => {
                if (group.deletedAt) {
                    throw new NotFoundException(`group with ID: ${group._id} has been deleted`);
                }
            });
            checkGroupId.forEach((isIdAvailable, index) => {
                if (!isIdAvailable) {
                    throw new NotFoundException(`group with ID: ${groupDto.childIds[index]} not found for childs`);
                }
            });
            groupChilds.forEach(group => {
                if (group.deletedAt) {
                    throw new NotFoundException(`group with ID: ${group._id} has been deleted`);
                }
            });
        }

        if (groupDto.parentId) {
            const groupParent = await this.groupRepository.findGroupById(groupDto.parentId);
            if (groupParent.length <= 0) {
                throw new NotFoundException(`group with ID: ${groupDto.parentId} not found for parent`);
            } else if (groupParent[0].deletedAt) {
                throw new NotFoundException(`group with ID: ${groupDto.parentId} has been deleted`);
            }
        }

        if (groupDto.userIds.length > 0) {
            const users = await this.groupRepository.findUserById(groupDto.userIds);
            const checkUserId = groupDto.userIds.map(userId => users.some(user => `${user._id}` === userId));
            checkUserId.forEach((isIdAvailable, index) => {
                if (!isIdAvailable) {
                    throw new NotFoundException(`user with ID: ${groupDto.userIds[index]} not found for users`);
                }
            });
            users.forEach(user => {
                if (user.deletedAt) {
                    throw new NotFoundException(`user with ID: ${user._id} has been deleted`);
                }
            });
        }

        if (groupDto.leaderId) {
            const leader = await this.groupRepository.findUserById(groupDto.leaderId);
            if (leader.length <= 0) {
                throw new NotFoundException(`user with ID: ${groupDto.leaderId} not found for leader`);
            } else if (leader[0].deletedAt) {
                throw new NotFoundException(`user with ID: ${leader._id} has been deleted`);
            }
        }
        try {
            insertedGroup = await GroupModel.create(groupDto);
            if (insertedGroup.childIds.length > 0) {
                insertedGroup.childIds.forEach(async childId => {
                    const childGroup = await this.groupRepository.findById(childId, ['parentId']);
                    childGroup.parentId = insertedGroup._id ?? null;
                    childGroup.save();
                });
            }
            if (insertedGroup.parentId) {
                const parentGroup = await this.groupRepository.findById(insertedGroup.parentId, ['childIds']);
                if (!parentGroup.childIds.includes(insertedGroup._id)) {
                    parentGroup.childIds.push(insertedGroup._id);
                    parentGroup.save();
                }
            }
        } catch (error) {
            this.logger.error(error.message);
        }
        return { _id: insertedGroup._id };
    }

    findAll(reqTransformed) {
        const queryBuilder = this.groupRepository.model.find();
        const filterDocument = {};

        reqTransformed.filters.forEach(filter => {
            if (!filterDocument[filter.column]) {
                filterDocument[filter.column] = {};
            }

            filterDocument[filter.column][filter.sign] = filter.value;
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
            queryBuilder.find(searchObj);
        }
        queryBuilder.find(filterDocument);
        return queryBuilder
            .limit(reqTransformed.pagination.size)
            .skip(reqTransformed.pagination.offset)
            .exec();
    }

    count() {
        return GroupModel.countDocuments({}).exec();
    }
}

export const GroupService = new Service();

