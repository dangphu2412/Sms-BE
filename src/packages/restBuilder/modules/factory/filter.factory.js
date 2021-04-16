import { logger } from '../../../../core/modules/logger/winston';
import { FilterValidator } from '../validator/filter.validator';

export class FilterFactory {
    static logger = logger;

    static filterValidator = new FilterValidator();

    constructor() {
        FilterFactory.logger.info(`${FilterFactory.name} factory is built`);
    }

    produce(req) {
        return this.transform(req);
    }

    transform(input) {
        const { filter } = input;
        let listFilter = [];

        if (!filter || filter.length === 0) return listFilter;

        if (typeof filter === 'string') {
            listFilter.push(this.transformOne(filter));
            return listFilter;
        }

        if (typeof filter === 'object') {
            listFilter = filter.map(item => this.transformOne(item));
        }

        return listFilter;
    }

    transformOne(filter) {
        const filterItems = filter.split('|');

        FilterFactory.filterValidator.validate(filterItems);

        return {
            column: filterItems[0],
            sign: filterItems[1],
            value: filterItems[2]
        };
    }
}
