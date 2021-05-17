import pick from 'lodash/pick';
import '../def';

class Service {
  /**
   *
   * @param {UserModel} user
   * @returns {UserInformation}
   */
    getUserInfo(user) {
        return pick(user, ['_id', 'email', 'profile', 'roles', 'avatar', 'status']);
    }
}

export const UserDataService = new Service();
