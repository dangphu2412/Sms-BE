import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { SortDirection } from '../../enum';

export class SortFactory {
    constructor() {
        LoggerFactory.globalLogger.info(`[${SortFactory.name}] is building`);
    }

    produce(req) {
        const { sort } = req;
        let listSortResult = [];

        if (!sort || sort.length === 0) return listSortResult;

        if (typeof sort === 'string') {
            listSortResult.push(SortFactory.transform(sort));
        }

        if (typeof sort === 'object' && sort.length > 0) {
            listSortResult = sort.map(item => SortFactory.transform(item));
        }

        return listSortResult;
    }

    static transform(sort) {
        const sortSchema = {
            sort: '',
            order: SortDirection['-']
        };
        const signCharacter = sort[0];
        const isDescendingDirection = SortDirection[signCharacter] === SortDirection['-'];

        if (isDescendingDirection) {
            sortSchema.sort = sort.slice(1, sort.length);
            return sortSchema;
        }

        sortSchema.sort = sort;
        sortSchema.order = SortDirection['+'];

        return sortSchema;
    }
}
