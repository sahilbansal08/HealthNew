import {readRecords} from 'react-native-health-connect';

const readHealthData = async (
  type,
  startTime,
  endTime,
  operator = 'between',
) => {
  try {
    const res = await readRecords(type, {
      timeRangeFilter: {
        operator,
        startTime,
        endTime,
      },
      ascendingOrder: true,
    });
    return res;
  } catch (error) {
    console.log(error);
  }
};

const getWeightList = async (type, startTime, endTime) => {
  const res = await readHealthData(type, startTime, endTime);
  return res.map(({weight, time}) => ({value: weight.inKilograms, time}));
};

const getStepsList = async (type, startTime, endTime) => {
  const res = await readHealthData(type, startTime, endTime);

  const result = res.reduce((acc, item) => {
    const datePart = item.endTime.split('T')[0];

    if (!acc[datePart]) {
      acc[datePart] = 0;
    }
    acc[datePart] += item.count;

    return acc;
  }, {});

  const resultArray = Object.keys(result).map(date => ({
    date,
    count: result[date],
  }));
  return [{total: resultArray}, {single: res}];
};

const getCaloriesList = async (type, startTime, endTime) => {
  const res = await readHealthData(type, startTime, endTime);
  const result = res.reduce((acc, item) => {
    const datePart = item.endTime.split('T')[0];

    if (!acc[datePart]) {
      acc[datePart] = 0;
    }
    acc[datePart] += item.energy.inKilocalories;

    return acc;
  }, {});

  const resultArray = Object.keys(result).map(date => ({
    date,
    count: result[date],
  }));
  return [{total: resultArray}, {single: res}];
};

export const androidHealthMethods = {
  Weight: getWeightList,
  Steps: getStepsList,
  TotalCaloriesBurned: getCaloriesList,
};
