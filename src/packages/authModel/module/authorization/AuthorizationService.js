import { logger } from 'core/utils';
import * as R from './AuthorizationValidator';

export class AuthorizationService {
    rules;

    /**
     *
     * @param {R.RuleData[]} rules
     * @returns
     */
    static builder(rules) {
        logger.info(`[${AuthorizationService.name} is bundling]`);
        const service = new AuthorizationService();
        service.rules = rules;
        return service;
    }

    buildValidator() {
        return new R.AuthorizationValidator(this.rules);
    }
}
