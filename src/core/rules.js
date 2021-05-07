export const Rules = {
    TEST_AUTHORIZATION: {
        name: 'UPDATE_PUBLIC_TASK',
        dataPreload: 'local=UserService.mustBeAuthor()',
        policies: ['UserService.isRoleAdmin(authContext,something)']
    }
};

export const ROLE = {
    LEADER: {
        permissions: ['TEST_AUTHORIZATION']
    },
    STAFF: {
        permissions: ['TEST_AUTHORIZATION']
    },
    SUPPORTER: {
        permissions: ['TEST_AUTHORIZATION']
    }
};
