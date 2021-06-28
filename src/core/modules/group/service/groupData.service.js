import { filterUndefinedKey, filterDuplicateValueByKey } from '../../../utils';

class Service {
    async mapUpdateDataToModel(groupData, dto) {
        const undefinedKeyFiltered = filterUndefinedKey({
            name: dto.name,
            leader: dto.leaderId,
            description: dto.description,
            parent: dto.parentId,
            members: dto.memberIds,
            childs: []
        });
        return filterDuplicateValueByKey(undefinedKeyFiltered, groupData);
    }
}

export const GroupDataService = new Service();
