// @ts-check
import { compareSync, hashSync, genSaltSync } from 'bcrypt';
import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { ConfigService } from 'packages/config/config.service';

class Bcrypt {
    saltRounds;

    /**
     * @param {number} saltRounds
     */
    constructor(saltRounds) {
        this.saltRounds = saltRounds;
        LoggerFactory.globalLogger.info('[BcryptService] is bundling');
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
}

export const BcryptService = new Bcrypt(Number.parseInt(ConfigService.getSingleton().get('SALT_ROUNDS'), 10));
