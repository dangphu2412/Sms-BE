import { upperFirst, camelCase } from 'lodash';
import { UnsupportedMethodException } from '../exceptions/unsupportedMethod.exception';
import { logger } from '../../modules/logger/winston';

export class BaseRepository {
  static logger = logger;

  /**
   * @type {import('mongoose').Model<Document>} model
   */
  model;

  constructor(model) {
      this.model = model;
      this.collection = model.collection.collectionName;
      BaseRepository.logger.info(`[${upperFirst(camelCase(this.collection))}Repository] is bundling`);
  }

  // UPSERT
  // eslint-disable-next-line no-unused-vars
  createOrUpdate(payload) {
      throw new Error('Method not implemented.');
  }

  count() {
      return this.model.estimatedDocumentCount();
  }

  find(query = {}, fields = []) {
      return this.model.find(query).select(fields).exec();
  }

  findByIds(ids, fields = []) {
      return this.model.find({ _id: { $in: ids } }).select(fields).exec();
  }

  findOne(condition, fields = []) {
      return this.model.findOne(condition, fields).exec();
  }

  findById(id, fields = []) {
      return this.model.findById(id, fields).exec();
  }

  create(payload) {
      return this.model.create(payload);
  }

  createMany(payload) {
      return this.model.insertMany(payload);
  }

  updateById(id, payload) {
      return this.model.findByIdAndUpdate(id, payload, { new: true });
  }

  updateMany(conditions, payload, options = {}) {
      return this.model.updateMany(conditions, payload, options);
  }

  findByIdAndDelete(id) {
      return this.model.findByIdAndDelete(id).exec();
  }

  softDeleteById(id) {
      if (!this.model.deletedAt) {
          throw new UnsupportedMethodException(this.collection, 'soft delete');
      }
      return this.updateById(id, { deletedAt: new Date() });
  }

  deleteMany(conditions, options = {}) {
      if (this.model.deletedAt) {
          return this.updateMany(conditions, { deletedAt: new Date() });
      }
      return this.model.deleteMany(conditions, options);
  }
}
