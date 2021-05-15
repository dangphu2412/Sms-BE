import { BaseContainer } from 'packages/container/core/container';

export class AuthorizationLookup extends BaseContainer {
    pattern = `${process.cwd()}/src/**/*.service.js`;

    static builder() {
        return new AuthorizationLookup();
    }
}
