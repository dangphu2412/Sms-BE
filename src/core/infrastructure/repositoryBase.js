export class RepositoryBase {
    /**
     * @type {import('mongoose').Model<Document>} model
     */
    model;

    constructor(model) {
        this.model = model;
    }

    findById(id, fields = []) {
        return this.model.findById(id).select(fields).exec();
    }

    findByIdAndDelete(id) {
        return this.model.findByIdAndDelete(id).exec();
    }

    create(document) {
        return this.model.create(document);
    }
}
