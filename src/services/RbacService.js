import rolePerms from "../permissions.json"
import features from "../features.json"
import { whoAmI } from "../mock/datas"

let instance = null;
class RbacService {
  #perms;

  constructor(user, allRolesPerms, features) {
    this.#perms = new Map();
    const existingPerms = new Set(allRolesPerms.map((role) => role.perms).flat());
    const featurePerms = new Set(
      features.map(feature => feature.actions).flat().map(action => {
        return Object.entries(action).filter(field => field[0] === 'perms').map(f => f[1]);
      }).flat()
    );
    const userRolePerms = new Set(allRolesPerms.find(a => a.role === user.role).perms)
    for (const perm of featurePerms) {
      
      this.#perms.set(perm, existingPerms.has(perm) && userRolePerms.has(perm));
    }
  }

  get perms() {
    return Object.freeze(Object.fromEntries(this.#perms));
  }
  set perms(value) {
    //? Depend on your use case, should it be updatable ?
  }

  hasPerms(perm) {
    return this.#perms.get(perm);
  }

  static getInstance() {
    if (!instance) {
      instance = new RbacService(whoAmI, rolePerms, features);
    }
    return instance;
  }
}

export default RbacService;