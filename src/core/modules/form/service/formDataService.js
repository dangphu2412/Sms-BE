class Service {
    mapUserIdForValidating(data) {
        const dto = {
            memberIds: []
        };
        return dto.memberIds.push(data.map(userIds => userIds.userId));
    }
}

export const FormDataService = new Service();
