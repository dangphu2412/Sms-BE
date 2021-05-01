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
}

export const GroupService = new Service();

