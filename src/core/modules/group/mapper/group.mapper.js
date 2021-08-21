/**
 * 
 * @param {import('../dto/createGroup.dto').ICreateGroupDto} groupCreationDto 
 * @returns 
 */
export function mapToModelByGroupCreationDto(groupCreationDto) {
    /**
     * When first created, parent group should not have any children group
     */
    const EMPTY_CHILDREN = [];

    return {
        name: groupCreationDto.name,
        leader: groupCreationDto.leaderId,
        groupTag: groupCreationDto.tagId,
        description: groupCreationDto.description,
        parent: groupCreationDto.parentId,
        members: groupCreationDto.memberIds,
        children: EMPTY_CHILDREN
    };
}

/**
 * 
 * @param {import('../dto/updateGroup.dto').IUpdateGroupDto} groupModificationDto 
 * @returns 
 */
export function mapToModelByGroupModificationDto(groupModificationDto) {
    return {
        name: groupModificationDto?.name,
        leader: groupModificationDto?.leaderId,
        groupTag: groupModificationDto?.tagId,
        description: groupModificationDto?.description,
        parent: groupModificationDto?.parentId,
        members: groupModificationDto?.memberIds,
        children: groupModificationDto?.childrenIds
    };
}
