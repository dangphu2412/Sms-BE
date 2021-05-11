import { BaseRepository } from 'core/infrastructure/repository';
import { UserModel } from '../model/userModel';

class Repository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

  /**
   *
   * @param email
   * @returns {Promise<UserModel | null>}
   */
  getAvailableByEmail(email) {
    return this.findOne({ email, deletedAt: null });
  }

  getByEmail(email) {
    return this.findOne({ email });
  }

  getDetailById(id) {
    return this.model.findById(id,
      ['_id', 'email', 'profile', 'status'],
      { timestamps: true });
  }

  createMany(payload) {
    return this.model.insertMany(payload);
  }

  getExistedEmail(emails) {
    return this.model.find({ email: { $in: emails } }, 'email');
  }
}

export const UserRepository = new Repository();
