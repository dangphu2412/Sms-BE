import pick from 'lodash/pick';

class Service {
  /**
   *
   * @param {UserModel} user
   * @returns {UserInformation}
   */
    getUserInfo(user) {
        return pick(user, ['_id', 'email', 'profile', 'roles', 'status']);
    }
}

export const UserDataService = new Service();
