import { StoreKeyRequired } from 'packages/authModel/exceptions/StoreKeyRequired';
import { RuleExecutionTransformer } from './RuleExecutionTransformer';

export class RuleTransformer {
    transformer = new RuleExecutionTransformer();

    transform(input) {
        const transformData = {
            policies: []
        };

        if (input.dataPreload) {
            transformData['dataPreload'] = this.transformer.transform(input.dataPreload);

            if (!transformData.dataPreload.storeKey) {
                throw new StoreKeyRequired(transformData.dataPreload, input.name);
            }
        }

        input.policies.forEach(policy => {
            transformData.policies.push(this.transformer.transform(policy));
        });

        return transformData;
    }
}
