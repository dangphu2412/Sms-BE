import pick from 'lodash/pick';

class Service {
  /**
   *
   * @param {Document} user
   */
    getUserInfo(user) {
        return pick(user, ['_id', 'profile', 'roles', 'email', 'status']);
    }
}

export const UserDataService = new Service();
