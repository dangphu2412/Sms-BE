import { LoggerFactory } from 'packages/logger/factory/logger.factory';
import { FilterSign } from 'packages/restBuilder/enum';
import { FilterValidator } from '../validator';

export class FilterFactory {
    static filterValidator = new FilterValidator();

    constructor() {
        LoggerFactory.globalLogger.info(`[${FilterFactory.name}] is building`);
    }

    produce({ filter }) {
        let listFilter = [];

        if (!filter || filter.length === 0) return listFilter;

        if (typeof filter === 'string') {
            listFilter.push(FilterFactory.transform(filter));
            return listFilter;
        }

        if (typeof filter === 'object') {
            listFilter = filter.map(item => FilterFactory.transform(item));
        }

        return listFilter;
    }

    static transform(filter) {
        const filterItems = filter.split('|');

        FilterFactory.filterValidator.validate(filterItems);

        return {
            column: filterItems[0],
            sign: FilterSign[filterItems[1]],
            value: filterItems[2]
        };
    }
}
