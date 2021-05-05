import { BaseRepository } from 'core/infrastructure/repository';
import { UserModel } from '../model/userModel';

class Repository extends BaseRepository {
  constructor() {
    super(UserModel);
  }

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
}

export const UserRepository = new Repository();
