import { getUserContext } from 'packages/authModel/module/user/UserContext';

export class UnionRoleGuard {
    #unionRoles;

    constructor(...roles) {
        this.#unionRoles = roles;
    }

    canActive(req) {
        const user = getUserContext(req);
        return user.roles
            .some(userRole => this.#unionRoles
                .some(roleMayRequired => roleMayRequired === userRole));
    }
}
