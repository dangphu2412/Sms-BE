class Service {
    mapCreateDtoToModel(dto) {
        return {
            name: dto.name,
            leader: dto.leaderId,
            description: dto.description,
            parent: dto.parentId,
            members: dto.memberIds,
            childs: []
        };
    }
}

export const GroupDataService = new Service();
