import { add, isBefore, isAfter, formatDistanceToNow } from "date-fns";
import FeatureService from "./FeatureService";

let instance = null;

/**
 * Generator based on Tuples of quota associated to a duration
 * @param {Set} tuples a Set of Object containing a quota and a duration descriptor
 */
const quotaByPeriodGenerator = function* (tuples) {
  const limitations = Array.from(tuples);
  const quotas = limitations.map((limit) => limit.hit);
  const durations = limitations.map((limit) => limit.duration);
  let counters = [...quotas].fill(0);
  let intervals = [...durations].map((duration) => {
    return add(new Date(), duration);
  });
  while (true) {
    try {
      //When generator is hit,
      //If current date is above one of the interval limit,
      //interval and associated counter can be reset
      if (!intervals.every((interval) => isBefore(new Date(), interval))) {
        intervals = intervals.map((interval, index) => {
          if (isBefore(new Date(), interval)) {
            return interval;
          } else {
            counters[index] = 0;
            return add(new Date(), durations[index]);
          }
        });
      }

      //Yield true or an Error with first quotas overreached
      if (counters.every((count, index) => count < quotas[index])) {
        //Increment all counters
        counters = counters.map((count) => count + 1);
        console.debug("Quota counters => ", counters.map((count, index) => `${count}/${quotas[index]}`));
        yield true;
      } 
      else {
        const index = counters.findIndex(
          (count, index) => count >= quotas[index]
        );
        yield new Error(
          `Quota limitation reached : [${Math.min(
            counters[index],
            quotas[index]
          )}/${quotas[index]}], wait ${formatDistanceToNow(intervals[index])}`
        );
      }
    } catch (error) {
      console.error(error);
    }
  }
};

class QuotaService {
  constructor() {
    this.featureActionGenerator = new Map();
    const featureActions = FeatureService.getInstance().featureActions;
    for (const [key, value] of featureActions) {
      this.featureActionGenerator.set(
        key,
        quotaByPeriodGenerator(new Set(value.quotas))
      );
    }
  }

  static getInstance() {
    if (!instance) {
      instance = new QuotaService();
    }
    return instance;
  }

  hasGenerator(generatorName) {
    return this.featureActionGenerator.has(generatorName);
  }

  getGenerator(generatorName) {
    return this.featureActionGenerator.get(generatorName);
  }
}

export default QuotaService;
