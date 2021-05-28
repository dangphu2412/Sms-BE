import { BaseContainer } from 'packages/container/core/container';

export class AuthorizationLookup extends BaseContainer {
    pattern = process.env.NODE_ENV === 'production'
        ? `${process.cwd()}/dist/**/*.service.js`
        : `${process.cwd()}/src/**/*.service.js`;

    static builder() {
        return new AuthorizationLookup();
    }
}
