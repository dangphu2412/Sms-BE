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

    /**
     * @notes This method will automatically collect page and size from requestTransform
     * @param {import('../requestTransformer').RequestTransformer} query
     * @returns {PageableMeta}
     */
    static builder(query, total) {
        const queryContent = query.content;
        this.currentPage = queryContent.pagination.page;
        this.currentSize = queryContent.pagination.size;
        this.totalRecord = total;
        return new PageableMeta();
    }

    /**
     * @notes We finalize builder by build method
     * @returns {{totalPage: number, currentPage, totalRecord, currentSize}}
     */
    build() {
        return {
            currentPage: this.currentPage,
            currentSize: this.currentSize,
            totalPage: Math.floor(this.totalRecord / this.currentSize),
            totalRecord: this.totalRecord
        };
    }
}
