import { obfuscatedFields } from "../mock/datas";
import { v4 as uuidv4 } from "uuid";
import QuotaService from "../services/QuotaService";
import RbacService from "../services/RbacService";

//#region Proxies handlers
//Profiling
const profilingHandler = {
  get(target, prop, receiver) {
    const guid = uuidv4();
    console.time(`${prop.toString()}-${guid}`);
    const returnValue = Reflect.get(...arguments);

    console.timeEnd(`${prop.toString()}-${guid}`);
    return returnValue;
  },
  set(target, prop, value, receiver) {
    const guid = uuidv4();
    console.time(`${prop.toString()}-${guid}`);
    const returnValue = Reflect.set(...arguments);
    console.timeEnd(`${prop.toString()}-${guid}`);
    return returnValue;
  },
};

//Loggin with obfuscation
const loginHandler = {
  get(target, prop, receiver) {
    if (obfuscatedFields.has(prop.toString()) && Reflect.has(target, prop)) {
      console.warn("⚠️🛂🔒🙈 obfuscated prop (you little trickster)");
    } else {
      console.debug("💭 get =>", target, prop);
    }
    return Reflect.get(...arguments);
  },
  set(target, prop, value, receiver) {
    console.debug("💭 set =>", target, prop);
    return Reflect.set(...arguments);
  },
};

//Memoization
const memoizationHandler = {
  get(target, prop) {
    let cache = new Map();
    if (cache.has(prop)) {
      return cache.get(prop);
    } else {
      const result = Reflect.get(...arguments);
      cache.set(prop, result);
      return result;
    }
  },
};

//Quota limitation handler
const quotaHandlerForFeature = {
  get(target, prop, receiver) {
    const featureName = "";
    const quotasGenerator =
      QuotaService.getInstance().getGenerator(featureName);
    if (quotasGenerator !== null) {
      const result = quotasGenerator.next().value;
      if (result instanceof Error) {
        throw result;
      }
    }
    return Reflect.get(...arguments);
  },
  set(target, prop, value, receiver) {
    const featureName = "";
    const quotasGenerator =
      QuotaService.getInstance().getGenerator(featureName);
    if (quotasGenerator !== null) {
      const result = quotasGenerator.next().value;
      if (result instanceof Error) {
        throw result;
      }
    }
    return Reflect.set(...arguments);
  },
};

//Proxy based RBAC - On permission Theta
const rbacThetaHandler = {
  get(target, prop, receiver) {
    let rbacManager = getIntance();
    if (!rbacManager.hasPerms('Theta')) {
      throw new Error("No way ! Missing permission Theta");
    } else {
      return Reflect.get(...arguments);
    }
  },
  set(target, prop, value, receiver) {
   let rbacManager = getIntance();
    if (!rbacManager.hasPerms('Theta')) {
      throw new Error("No way ! Missing permission Theta");
    } else {
      return Reflect.set(...arguments);
    }
  },
};
//#endregion

//#region Decorators

//Quota limitation
const quota = function (featureName) {
  return function (target, context) {
    //Initializer
    //You could set your QuotaService state based on an API
    return function (...args) {
      //On invocation of method which is decorated
      if (context.kind === "method") {
        console.debug("Retriving quota decorator for", featureName);
        const quotaService = QuotaService.getInstance();
        if (quotaService.hasGenerator(featureName)) {
          const generator = quotaService.getGenerator(featureName);
          const result = generator.next().value;
          console.debug("Quota limitation for ", featureName, result);
          if (result instanceof Error) {
            console.warn(`Quota decorator throw an error`, result);
            throw result;
          }
        }
      }
      target.call(this, ...args);
    };
  };
};

//Decorator based RBAC - On ANY permission
const can = function (permission) {
  return function (target, context) {
    //Initializer
    //You could set your QuotaService state based on an API
    return function (...args) {
      //On invocation of method which is decorated
      if (context.kind === "method") {
        const rbacService = RbacService.getInstance();
        const hasPerm = rbacService.hasPerms(permission);
        if (!hasPerm) {
          throw new Error(`⛔ No way ! Missing permission ${permission}`);
        } else {
          target.call(this, ...args);
        }
      }
    };
  };
}
//#endregion

export { profilingHandler, loginHandler, memoizationHandler, quotaHandlerForFeature, quota, can };
