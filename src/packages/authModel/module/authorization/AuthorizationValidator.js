/* eslint-disable no-await-in-loop */
import { MapperUtil } from 'packages/authModel/common/utils/MapperUtil';
import { ForbiddenException } from 'packages/httpException/ForbiddenException';
import { RuleTransformer } from '../rule/RuleTransformer';
import { AuthorizationLookup } from './AuthorizationLookup';

/**
 * @typedef RuleData
 * @property {string} name
 * @property {RuleExecution[]} policies
 * @property {RuleExecution} dataPreload
 * @property {RuleExecution[]} policyRefs
 */
/**
 * @typedef RuleExecution
 * @property {string} storeKey
 * @property {string} methodName
 * @property {string} service
 * @property {any[]} args
 */

export class AuthorizationValidator {
    /**
   * @type {AuthorizationLookup}
   */
    static appStorage;

    static baseRule;

    executionContexts = [];

    localStorage = {};

    constructor(baseRule) {
        AuthorizationValidator.baseRule = baseRule;
    }

    static addAuthorizeStore(store) {
        if (!(store instanceof AuthorizationLookup)) {
            throw new Error(
                `Store in authorization validator should be instance of AuthorizationLookup here we are getting ${store}`
            );
        }
        AuthorizationValidator.appStorage = store;
    }

    #extractRuleExecution = rule => {
        const ruleInfo = AuthorizationValidator.baseRule[rule];
        return new RuleTransformer().transform(ruleInfo);
    }

    #executeRule = (rule, params) => AuthorizationValidator.appStorage
        .getMethodOfClass(rule.service, rule.methodName)(...params)

    getFromStore(key) {
        return this.localStorage[key];
    }

    /**
     *
     * @param {string[]} rules
     */
    addRules(...rules) {
        rules.forEach(rule => {
            this.executionContexts.push(
                this.#extractRuleExecution(rule)
            );
        });

        return this;
    }

    addParams(params) {
        Object.keys(params).forEach(key => {
            this.localStorage[key] = params[key];
        });
        return this;
    }

    async validate() {
        while (this.executionContexts.length > 0) {
            const context = this.executionContexts.pop();
            if (context.dataPreload) {
                const params = MapperUtil.map(context.dataPreload.args, this.localStorage);
                this.localStorage[context.dataPreload.storeKey] = await this
                    .#executeRule(context.dataPreload, params);
            }

            while (context.policies.length > 0) {
                let isValidated;
                const currentPolicy = context.policies.shift();
                const params = MapperUtil.map(currentPolicy.args, this.localStorage);

                if (currentPolicy.storeKey) {
                    isValidated = await this.#executeRule(currentPolicy, params);

                    this.localStorage[currentPolicy.storeKey] = isValidated;
                } else {
                    isValidated = await this.#executeRule(currentPolicy, params);
                }

                if (currentPolicy.service.startsWith('!')) {
                    isValidated = !isValidated;
                }

                if (!isValidated) throw new ForbiddenException();
            }
        }
    }
}
