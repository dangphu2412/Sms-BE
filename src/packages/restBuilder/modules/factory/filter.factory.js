import { FilterSign } from 'packages/restBuilder/enum';
import { logger } from '../../../../core/modules/logger/winston';
import { FilterValidator } from '../validator/filter.validator';

export class FilterFactory {
    static logger = logger;

    static filterValidator = new FilterValidator();

    constructor() {
        FilterFactory.logger.info(`[${FilterFactory.name}] is building`);
    }

    produce({ filter }) {
        let listFilter = [];

        if (!filter || filter.length === 0) return listFilter;

        if (typeof filter === 'string') {
            listFilter.push(this.transform(filter));
            return listFilter;
        }

        if (typeof filter === 'object') {
            listFilter = filter.map(item => this.transform(item));
        }

        return listFilter;
    }

    transform(filter) {
        const filterItems = filter.split('|');

        FilterFactory.filterValidator.validate(filterItems);

        return {
            column: filterItems[0],
            sign: FilterSign[filterItems[1]],
            value: filterItems[2]
        };
    }
}
