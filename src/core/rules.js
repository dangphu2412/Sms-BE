export const Rules = {
    TEST_AUTHORIZATION: {
        name: 'UPDATE_PUBLIC_TASK',
        dataPreload: 'local=UserService.mustBeAuthor()',
        policies: ['UserService.isRoleAdmin(authContext,something)']
    }
};

export const Role = {
    ADMIN: {
        name: 'ADMIN',
        permissions: ['TEST_AUTHORIZATION']
    },
    LEADER: {
        name: 'LEADER',
        permissions: ['TEST_AUTHORIZATION']
    },
    MEMBER: {
        name: 'MEMBER',
        permissions: ['TEST_AUTHORIZATION']
    }
};
