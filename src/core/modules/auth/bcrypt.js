// @ts-check
import { compareSync, hashSync, genSaltSync } from 'bcryptjs';
import { SALT_ROUNDS } from '../../env';
import { logger } from '../logger/winston';

class Bcrypt {
    saltRounds;

    /**
     * @param {number} saltRounds
     */
    constructor(saltRounds) {
        this.saltRounds = saltRounds;
        logger.info('initiate bcrypt module');
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

export const BcryptService = new Bcrypt(SALT_ROUNDS);
