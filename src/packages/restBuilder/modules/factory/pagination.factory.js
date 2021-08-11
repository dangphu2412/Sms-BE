import { LoggerFactory } from 'packages/logger/factory';
import { BadRequestException } from 'packages/httpException';

export class PaginationFactory {
    static DEFAULT_RADIX = 10;

    static MAX_PAGE = null;

    static MAX_SIZE = null;

    static DEFAULT_PAGE = null;

    static DEFAULT_SIZE = null;

    constructor() {
        LoggerFactory.globalLogger.info(`[${PaginationFactory.name}] is building`);
    }

    produce({ page, size }) {
        let parsedPage = Number.parseInt(page, PaginationFactory.DEFAULT_RADIX);
        let parsedSize = Number.parseInt(size, PaginationFactory.DEFAULT_RADIX);

        if (Number.isNaN(parsedPage)) {
            parsedPage = PaginationFactory.DEFAULT_PAGE;
        } else if (parsedPage > PaginationFactory.MAX_PAGE) {
            throw new BadRequestException('Page reach max');
        } else if (parsedPage <= 0) {
            throw new BadRequestException('Page should be greater than 0');
        }

        if (Number.isNaN(parsedSize)) {
            parsedSize = PaginationFactory.DEFAULT_SIZE;
        } else if (parsedSize > PaginationFactory.MAX_SIZE) {
            throw new BadRequestException('Size reach max');
        } else if (parsedPage < 0) {
            throw new BadRequestException('Size must not be a negative number');
        }

        return {
            page: parsedPage,
            size: parsedSize,
            offset: (parsedPage - 1) * parsedSize
        };
    }

    static receive(obj) {
        PaginationFactory.MAX_PAGE = obj.MAX_PAGE;
        PaginationFactory.MAX_SIZE = obj.MAX_SIZE;
        PaginationFactory.DEFAULT_PAGE = obj.DEFAULT_PAGE;
        PaginationFactory.DEFAULT_SIZE = obj.DEFAULT_SIZE;
    }
}
