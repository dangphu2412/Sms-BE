import { AUTH_CONTEXT } from '../../common/enum/authContext';
import { JwtValidator } from './JwtValidator';
import { UserDetail } from '../user/UserDetail';
import { InvalidInstance } from '../../exceptions/InvalidInstance';

export class JwtAuthAdapter {
    static USER_DETAIL_CLASS = UserDetail;

    static builder() {
        return new JwtAuthAdapter();
    }

    #token;

    #userDetail;

    #detachAuthContextToReq = req => {
        if (this.#userDetail) {
            req[AUTH_CONTEXT.KEY_AUTH_CONTEXT] = this.#userDetail;
        }
    }

    #applyPreAuthorizationToUserDetail = () => {
        this.#userDetail.toRoles();
        this.#userDetail.toPermissions();
    }

    applyCustomUserDetail(customUserDetailClass) {
        if (customUserDetailClass instanceof UserDetail) {
            JwtAuthAdapter.USER_DETAIL_CLASS = customUserDetailClass;
        } else {
            throw new InvalidInstance(customUserDetailClass, JwtAuthAdapter.USER_DETAIL_CLASS);
        }
    }

    collectRequest(req) {
        this.#token = req.headers[AUTH_CONTEXT.AUTHORIZATION_HEADER];
        return this;
    }

    transfer(req) {
        if (this.#token) {
            JwtValidator
                .builder()
                .applyToken(this.#token)
                .validate();

            this.#userDetail = new JwtAuthAdapter.USER_DETAIL_CLASS();
            this.#applyPreAuthorizationToUserDetail();

            this.#detachAuthContextToReq(req);
        }
    }
}
