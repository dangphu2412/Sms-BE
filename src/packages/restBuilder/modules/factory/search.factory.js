import { LoggerFactory } from 'packages/logger/factory/logger.factory';

export class SearchFactory {
    static REGEX_SEARCH_CLEANER = '/[^\\w\\s]/gi';

    constructor() {
        LoggerFactory.globalLogger.info(`[${SearchFactory.name}] is building`);
    }

    produce(req) {
        const { search } = req;
        const schema = {};

        if (!search || search.length === 0) return null;

        schema.value = search.replace(
            SearchFactory.REGEX_SEARCH_CLEANER,
            ''
        );

        schema.criteria = req.searchSchema;

        return schema;
    }
}
