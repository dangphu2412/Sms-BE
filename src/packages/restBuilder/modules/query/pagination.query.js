export class PaginationQuery {
    limit;

    offset;

    constructor({ size, offset }) {
        this.limit = size;
        this.offset = offset;
    }
}
