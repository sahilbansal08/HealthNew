import AppleHealthKit from 'react-native-health';

const readStepCount = async options => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getDailyStepCountSamples(options, (callbackError, results) => {
      if (callbackError) {
        reject(callbackError);
      } else {
        resolve(results);
      }
    });
  });
  return results;
};

const readHeartRate = async options => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getHeartRateSamples(
      {...options, unit: 'bpm'},
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

const readSleep = async options => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getSleepSamples(
      {...options, ascending: true},
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

const readBmi = async options => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getLatestBmi(
      {...options, ascending: true},
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

const readWeightList = async options => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getWeightSamples(
      {...options, unit: 'lbs', ascending: true},
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

const readHeightList = async options => {
  const results = await new Promise((resolve, reject) => {
    AppleHealthKit.getHeightSamples(
      {...options, unit: 'inch', ascending: true},
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

export const healthMethods = {
  Steps: readStepCount,
  HeartRate: readHeartRate,
  SleepSession: readSleep,
  Weight: readWeightList,
  Height: readHeightList,
  BodyMassIndex: readBmi,
};
