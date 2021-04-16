import { logger } from '../../../../core/modules/logger/winston';
import { SortDirection } from '../../enum';

export class SortFactory {
    static logger = logger

    constructor() {
        SortFactory.logger.info(`${SortFactory.name} factory is built`);
    }

    produce(req) {
        return this.transform(req);
    }

    transform(input) {
        const { sort } = input;
        let listSortResult = [];

        if (!sort || sort.length === 0) return listSortResult;

        if (typeof sort === 'string') {
            listSortResult.push(SortFactory.transformOne(sort));
        }

        if (typeof sort === 'object' && sort.length > 0) {
            listSortResult = sort.map(item => SortFactory.transformOne(item));
        }

        return listSortResult;
    }

    static transformOne(sort) {
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
