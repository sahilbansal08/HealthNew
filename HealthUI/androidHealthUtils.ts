import moment from 'moment';
import {readRecords} from 'react-native-health-connect';
import {
  ExerciseSessionRecord,
  HeartRateRecord,
  RecordType,
  WeightRecord,
} from 'react-native-health-connect/lib/typescript/types';
import {TimeRangeFilter} from 'react-native-health-connect/lib/typescript/types/base.types';
import {healthAndroidMethodsType} from './utils';

const readHealthData = async (
  type: RecordType,
  startTime: string,
  endTime: string,
  operator?: TimeRangeFilter['operator'],
) => {
  try {
    const res = await readRecords(type, {
      timeRangeFilter: {
        operator: operator || 'between',
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

const getWeightList = async (
  type: RecordType,
  startTime: string,
  endTime: string,
) => {
  const res = (await readHealthData(
    type,
    startTime,
    endTime,
  )) as WeightRecord[];
  return res?.map(value => ({
    value: value.weight.inGrams,
    time: value.time,
  }));
};

const calculateTotalCount = (data: any) => {
  // Calculate total count
  const totalCount = data.reduce(
    (
      accumulator: any,
      item: {count: number; energy: {inKilocalories: number}},
    ) => accumulator + (item.count || Math.floor(item.energy.inKilocalories)),
    0,
  );

  // Format dates using Moment.js
  const formattedData = data.map(
    (item: {startTime: moment.MomentInput; endTime: moment.MomentInput}) => ({
      ...item,
      startTime: moment(item.startTime).format('YYYY-MM-DD HH:mm:ss'),
      endTime: moment(item.endTime).format('YYYY-MM-DD HH:mm:ss'),
    }),
  );

  return {totalCount, formattedData};
};

const getStepsList = async (
  type: RecordType,
  startTime: string,
  endTime: string,
) => {
  const res = await readHealthData(type, startTime, endTime);
  const result = calculateTotalCount(res);
  return [{total: result.formattedData, value: result.totalCount}];
};

const getCaloriesList = async (
  type: RecordType,
  startTime: string,
  endTime: string,
) => {
  const res = await readHealthData(type, startTime, endTime);
  const result = calculateTotalCount(res);
  return [{total: result.formattedData, value: Math.floor(result.totalCount)}];
};

function getTimeDifferenceInMinutes(startDate: string, endDate: string) {
  const start = moment(startDate);
  const end = moment(endDate);

  const differenceInMinutes = end.diff(start, 'minutes');

  return differenceInMinutes;
}

const getExerciseTime = async (
  type: RecordType,
  startTime: string,
  endTime: string,
) => {
  const res = (await readHealthData(
    type,
    startTime,
    endTime,
  )) as ExerciseSessionRecord[];
  const result = res?.reduce((accumulator, value) => {
    return (
      accumulator + getTimeDifferenceInMinutes(value.startTime, value.endTime)
    );
  }, 0);
  return [{value: result}];
};

const getHeartrate = async (
  type: RecordType,
  startTime: string,
  endTime: string,
) => {
  const res = (await readHealthData(
    type,
    startTime,
    endTime,
  )) as HeartRateRecord[];
  return [{value: res?.[res?.length - 1]?.samples?.[0]?.beatsPerMinute}];
};

export const androidHealthMethods: healthAndroidMethodsType = {
  Weight: getWeightList,
  Steps: getStepsList,
  TotalCaloriesBurned: getCaloriesList,
  HeartRate: getHeartrate,
  ExerciseSession: getExerciseTime,
};
