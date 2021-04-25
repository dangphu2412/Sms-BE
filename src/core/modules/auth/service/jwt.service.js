import { sign, decode } from 'jsonwebtoken';
import { JWT_SECRET, EXPIRE_DAYS } from '../../../env';
import { logger } from '../../logger/winston';

class JwtService {
    static logger = logger;

    secret = JWT_SECRET;

    expiresIn = EXPIRE_DAYS;

    constructor() {
        JwtService.logger.info('Building jwt module');
    }

    sign(payload) {
        return sign(payload, this.secret, {
            expiresIn: this.expiresIn
        });
    }

    decode(token) {
        return decode(token);
    }
}

export const JwtSingleton = new JwtService();
