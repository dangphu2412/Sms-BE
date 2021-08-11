// @ts-check
import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { LoggerFactory } from 'packages/logger/factory';
import { ConfigService } from 'packages/config/config.service';
import { UnAuthorizedException } from 'packages/httpException';

class BcryptServiceImpl {
    static DEFAULT_MSG_INCOMPATIBLE_PWD = 'Your current password is incorrect';

    saltRounds;

    constructor() {
        this.saltRounds = Number.parseInt(ConfigService.getSingleton().get('SALT_ROUNDS'), 10);
        LoggerFactory.globalLogger.info(`[${BcryptServiceImpl.name}] is bundling`);
    }

    /**
     * @param {string} str normal string
     * @param {string} hashed hashed string
     */
    compare(str, hashed) {
        return compareSync(str, hashed);
    }

    /**
     * @param {string} str to be hashed
     */
    hash(str) {
        const salt = genSaltSync(this.saltRounds);
        return hashSync(str, salt);
    }

    verifyComparison(str, hashed, msg = BcryptServiceImpl.DEFAULT_MSG_INCOMPATIBLE_PWD) {
        if (!this.compare(str, hashed)) {
            throw new UnAuthorizedException(msg);
        }
    }
}

export const BcryptService = new BcryptServiceImpl();
