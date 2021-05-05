import { BaseRepository } from 'core/infrastructure/repository';
import { UserModel } from '../model/userModel';

class Repository extends BaseRepository {
  constructor() {
    super(UserModel);
  }
}

export const UserRepository = new Repository();
