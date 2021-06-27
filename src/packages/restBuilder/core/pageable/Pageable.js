/**
 * @notes
- This class is a builder
- It help us to return a format of pagination
{
    content,
    meta,
    previous,
    next
}
- We need to add content when we construct by of() method
 */
export class Pageable {
    content;

    meta;

    previous;

    next;

    /**
     * @notes Provide builder instance with specific content
     * @param {any} content
     * @returns {Pageable}
     */
    static of(content) {
        return new Pageable(content);
    }

    constructor(content) {
        this.content = content;
    }

    /**
     *
     * @param {{totalPage: number, currentPage, totalRecord, currentSize}} meta
     * @returns {Pageable}
     */
    addMeta(meta) {
        this.meta = meta;
        return this;
    }

    /**
     * @notes Provide link to previous page
     * @param link
     * @returns {Pageable}
     */
    addPreviousLink(link) {
        this.previous = link;
        return this;
    }

    /**
     * @notes Provide link to next page
     * @param link
     * @returns {Pageable}
     */
    addNextLink(link) {
        this.next = link;
        return this;
    }

    /**
     * @notes We finalize builder by build method
     * @returns {{next, previous, meta, content}}
     */
    build() {
        return {
            content: this.content,
            meta: this.meta,
            previous: this.previous,
            next: this.next
        };
    }
}
