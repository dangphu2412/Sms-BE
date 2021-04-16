/**
 * @notes
 - This class is a builder
 - It help us to return a format of pagination meta data
 {
    currentPage,
    currentSize,
    totalPage,
    totalRecord
 }
 - We need to add content when we construct by of() method
 */
export class PageableMeta {
    currentPage;

    currentSize;

    totalPage;

    totalRecord;

    static builder() {
        return new PageableMeta();
    }

    /**
     * @notes This method will automatically collect page and size from requestFormation
     * @param {import('../requestFormation').RequestFormation} query
     * @returns {PageableMeta}
     */
    appendRequestFormation(query) {
        const queryContent = query.translate();
        this.currentPage = queryContent.pagination.page;
        this.currentSize = queryContent.pagination.size;
        return this;
    }

    /**
     * @notes Apply total record which helping to navigate to the final page
     * @param {number} total
     * @returns {PageableMeta}
     */
    appendTotalRecord(total) {
        this.totalRecord = total;
        return this;
    }

    /**
     * @notes We finalize builder by build method
     * @returns {{totalPage: number, currentPage, totalRecord, currentSize}}
     */
    build() {
        return {
            currentPage: this.currentPage,
            currentSize: this.currentSize,
            totalPage: Math.floor(this.totalRecord / this.currentSize) + 1,
            totalRecord: this.totalRecord
        };
    }
}
