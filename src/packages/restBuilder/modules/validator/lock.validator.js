import { BadRequestException } from 'packages/httpException';

export class LockValidator {
    sorts;

    filters;

    static builder() {
        return new LockValidator();
    }

    applySortContext(sorts) {
        this.sorts = sorts;
        return this;
    }

    applyFilterContext(filters) {
        this.filters = filters;
        return this;
    }

    validate(obj) {
        if (!obj) return;

        const { filters, sorts } = obj;

        if (Array.isArray(sorts) && this.sorts.length > 0) {
            const isNotValidField = !this.sorts.some(item => sorts.includes(item.sort));

            if (isNotValidField) {
                throw new BadRequestException('Invalid sort field');
            }
        } else {
        // TODO: develop in the future
        // - Support for ban fields and allows fields
        }
        if (Array.isArray(filters) && this.filters.length > 0) {
            const isNotInvalidField = !this.filters.some(item => filters.includes(item.column));

            if (isNotInvalidField) {
                throw new BadRequestException('Invalid filter field');
            }
        } else {
        // TODO: develop in the future
        // - Support for ban fields and allows fields
        }
    }
}
