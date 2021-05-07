import { RuleSplitCase } from 'packages/authModel/common/enum/ruleSplitCase';
import { InvalidRuleDefinition } from 'packages/authModel/exceptions/InvalidRuleDefinition';

/* @notes
 Case example:
 - "local=service.findUser(param,user)"
 - "!service.isAdmin(var,ad)"
 - "service.isAdmin(var)"
 - "service.isAdmin()"
 */
export class RuleExecutionTransformer {
    static PATTERN_SPLIT_RULE = /[=#()]/;

    static PATTERN_SPLIT_SERVICE_AND_METHOD = '.';

    static toRuleExecution(
        executionMethod,
        params,
        storeKey
    ) {
        const [service, methodName] = executionMethod.split('.');
        let args;
        if (params) {
            args = params.split(',').map(param => param.trim());
        } else args = [];
        return {
            service,
            methodName,
            args,
            storeKey
        };
    }

    transform(input) {
        const ruleExecutionCollection = input
            .split(RuleExecutionTransformer.PATTERN_SPLIT_RULE)
            .filter(val => val !== '');
        switch (ruleExecutionCollection.length) {
            case RuleSplitCase.NO_PARAMS:
                return RuleExecutionTransformer.toRuleExecution(ruleExecutionCollection[0]);

            /** @notes:
            Example for this case:
            - localVariable=service.isAdmin() -> first argument will be used as storeKey
            - service.exec(param1,param2) -> first argument will be used as methodExecution
            */
            case RuleSplitCase.STORE_OR_EXEC: {
                return ruleExecutionCollection[0]
                    .includes(
                        RuleExecutionTransformer.PATTERN_SPLIT_SERVICE_AND_METHOD
                    )
                    ? RuleExecutionTransformer.toRuleExecution(
                        ruleExecutionCollection[0],
                        ruleExecutionCollection[1]
                    )
                    : RuleExecutionTransformer.toRuleExecution(
                        ruleExecutionCollection[1],
                        '',
                        ruleExecutionCollection[0]
                    );
            }
            case RuleSplitCase.STORE: {
                const [storeKey, executionMethod, params] = ruleExecutionCollection;
                return RuleExecutionTransformer.toRuleExecution(executionMethod, params, storeKey);
            }
            default:
                throw new InvalidRuleDefinition(ruleExecutionCollection);
        }
    }
}
