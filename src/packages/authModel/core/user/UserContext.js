import { AUTH_CONTEXT } from '../../common/enum/authContext';

export function UserContext(req) {
    return req[AUTH_CONTEXT.KEY_AUTH_CONTEXT];
}
