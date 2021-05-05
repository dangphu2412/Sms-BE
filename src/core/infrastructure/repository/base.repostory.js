export class BaseRepository {
  /**
   * @type {import('mongoose').Model<Document>} model
   */
  model;

  constructor(model) {
    this.model = model;
    this.collection = model.collection.collectionName;
  }

  // eslint-disable-next-line no-unused-vars
  execute(query) {
    // Do raw execute
    throw new Error('Method not implemented.');
  }

  // READ
  count() {
    return this.model.estimatedDocumentCount();
  }

  findOne(filter, fields = []) {
    return this.model.findOne(filter, fields).exec();
  }

  findById(id, fields = []) {
      return this.model.findById(id, fields).exec();
  }

  findByIdAndDelete(id) {
      return this.model.findByIdAndDelete(id).exec();
  }

  // CREATE
  create(payload) {
    return this.model.create(payload);
  }

  // UPSERT
  // eslint-disable-next-line no-unused-vars
  createOrUpdate(payload) {
    throw new Error('Method not implemented.');
  }

  // UPDATE
  updateById(id, payload) {
    return this.model.findByIdAndUpdate(id, payload);
  }

  updateMany(conditions, payload, options = {}) {
    return this.model.updateMany(conditions, payload, options);
  }

  // DELETE
  deleteById(id) {
    if (this.model.deletedAt) {
      return this.updateById(id, { deletedAt: new Date() });
    }
    return this.model.findByIdAndDelete(id);
  }

  deleteMany(conditions, options = {}) {
    if (this.model.deletedAt) {
      return this.updateMany(conditions, { deletedAt: new Date() });
    }
    return this.model.deleteMany(conditions, options);
  }
}
