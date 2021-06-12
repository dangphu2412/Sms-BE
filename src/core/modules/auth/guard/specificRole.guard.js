import { getUserContext } from 'packages/authModel/module/user/UserContext';

export class SpecificRoleGuard {
    #role;

    constructor(role) {
        this.#role = role;
    }

    canActive(req) {
        const user = getUserContext(req);
        return user.roles.some(role => role === this.#role);
    }
}
