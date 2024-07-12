import AppleHealthKit, {HealthUnit} from 'react-native-health';
import {healthIosMethodsType} from './HealthUI/utils';

export interface Options {
  startDate: string;
  endDate: string;
  ascending: boolean;
}

const readStepCount = async (options: Options) => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getDailyStepCountSamples(
      options,
      (callbackError, results) => {
        if (callbackError) {
          reject(callbackError);
        } else {
          resolve(results);
        }
      },
    );
  });
  return results;
};

const readHeartRate = async (options: Options) => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getHeartRateSamples(
      {...options, unit: 'bpm' as HealthUnit.bpm},
      (callbackError, results) => {
        if (callbackError) {
          reject(callbackError);
        } else {
          resolve(results);
        }
      },
    );
  });
  return results;
};

const readWeightList = async (options: Options) => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getWeightSamples(
      {...options, unit: 'gram' as HealthUnit.gram},
      (callbackError, results) => {
        if (callbackError) {
          reject(callbackError);
        } else {
          resolve(results);
        }
      },
    );
  });
  return results;
};

const readStandTime = async (options: Options) => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getAppleStandTime(options, (callbackError, results) => {
      if (callbackError) {
        reject(callbackError);
      } else {
        resolve(results);
      }
    });
  });
  return results;
};

const readExerciseTime = async (options: Options) => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getAppleExerciseTime(options, (callbackError, results) => {
      if (callbackError) {
        reject(callbackError);
      } else {
        resolve(results);
      }
    });
  });
  return results;
};

const readEnergy = async (options: Options) => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getActiveEnergyBurned(options, (callbackError, results) => {
      if (callbackError) {
        reject(callbackError);
      } else {
        resolve(results);
      }
    });
  });
  return results;
};

export const healthMethods: healthIosMethodsType = {
  Steps: readStepCount,
  HeartRate: readHeartRate,
  Weight: readWeightList,
  ActiveEnergyBurned: readEnergy,
  AppleStandTime: readStandTime,
  AppleExerciseTime: readExerciseTime,
};
