import features from "../features.json";

let instance = null;

class FeatureService {
  constructor() {
    this.features = features;
    this.featureActions = new Map();
    for (const feature of features) {
      for (const action of feature.actions) {
        this.featureActions.set(`${feature.feature}.${action.action}`, {
          perms: action.perms,
          quotas: action.quotas,
        });
      }
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new FeatureService();
    }
    return instance;
  }

  hasFeature(name) {
    return this.features.find((f) => f.feature === name);
  }

  isActive(name) {
    return this.features.filter((f) => f.feature === name).isActive;
  }
}

export default FeatureService;
