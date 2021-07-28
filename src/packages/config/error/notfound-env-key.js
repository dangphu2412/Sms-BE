export class NotFoundEnvKey extends Error {
    constructor(key, nodeEnv) {
        super(
            `Can not retrieve key: ${key} from environment. You need to provide it in ${nodeEnv}.env file`,
        );
    }
}
