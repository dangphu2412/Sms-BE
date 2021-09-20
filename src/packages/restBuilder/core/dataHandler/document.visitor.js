export class DocumentVisitor {
    document;

    constructor(document) {
        this.document = document.toObject({ getters: true });
    }

    visit() { throw new Error('Extended class of DocumentVisitor has not implemented visit method'); }
}
