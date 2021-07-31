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
        const meta = new PageableMeta();
        meta.currentPage = queryContent.pagination.page;
        meta.currentSize = queryContent.pagination.size;
        meta.totalRecord = total;
        return meta;
    }

    static with(page, size, total) {
        const meta = new PageableMeta();
        meta.currentPage = page;
        meta.currentSize = size;
        meta.totalRecord = total;
        return meta;
    }

    /**
     * @notes We finalize builder by build method
     * @returns {{totalPage: number, currentPage, totalRecord, currentSize}}
     */
    build() {
        return {
            currentPage: this.currentPage,
            currentSize: this.currentSize,
            totalPage: Math.ceil(this.totalRecord / this.currentSize),
            totalRecord: this.totalRecord
        };
    }
}
