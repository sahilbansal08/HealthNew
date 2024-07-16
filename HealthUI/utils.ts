import {Platform} from 'react-native';
import {
  Permission,
  RecordType,
} from 'react-native-health-connect/lib/typescript/types';
import {Options} from './iosHealthUtils';
import {HealthKitPermissions} from 'react-native-health';
import moment from 'moment';

const readAccessType = 'read';

export const iosPermissions: HealthKitPermissions = {
  permissions: {
    read: [
      'Weight',
      'HeartRate',
      'Steps',
      'AppleExerciseTime',
      'AppleExerciseTime',
      'ActiveEnergyBurned',
    ],
    write: [],
  },
} as HealthKitPermissions;

export const androidPermissions: Permission[] = [
  {
    accessType: readAccessType,
    recordType: 'Steps',
  },
  {
    accessType: readAccessType,
    recordType: 'Weight',
  },
  {
    accessType: readAccessType,
    recordType: 'HeartRate',
  },
  {
    accessType: readAccessType,
    recordType: 'ActiveCaloriesBurned',
  },
];

export const modifyValue = (type: string, value: number) => {
  if (type === 'Weight' && value) {
    return value / 1000;
  }
  return value ? Math.floor(value) : '--';
};

export const isIos = Platform.OS === 'ios';

export const units: TitleType = {
  Weight: 'Kg',
  HeartRate: 'bpm',
  ActiveEnergyBurned: 'kcal',
  Steps: 'steps',
  TotalCaloriesBurned: 'kcal',
  ExerciseSession: 'min',
  AppleStandTime: 'min',
  AppleExerciseTime: 'min',
};

export const title: TitleType = {
  ActiveEnergyBurned: 'Calories',
  AppleExerciseTime: 'Exercise Time',
  AppleStandTime: 'Stand',
  TotalCaloriesBurned: 'Calories',
  ExerciseSession: 'Exercise Time',
  Steps: 'Steps',
  HeartRate: 'HeartRate',
  Weight: 'Weight',
};

export type types = IosTypes | AndroidTypes;

export type IosTypes =
  | 'Weight'
  | 'Steps'
  | 'HeartRate'
  | 'ActiveEnergyBurned'
  | 'AppleStandTime'
  | 'AppleExerciseTime';

export type AndroidTypes =
  | 'Weight'
  | 'Steps'
  | 'HeartRate'
  | 'TotalCaloriesBurned'
  | 'ExerciseSession';

export type TitleType = {
  [key in types]: string;
};

export type healthIosMethodsType = {
  [key in IosTypes]: (options: Options) => Promise<unknown>;
};

export type healthAndroidMethodsType = {
  Weight: (
    type: RecordType,
    startTime: string,
    endTime: string,
  ) => Promise<
    {
      value: any;
      time: string;
    }[]
  >;
  Steps: (
    type: RecordType,
    startTime: string,
    endTime: string,
  ) => Promise<
    {
      total: any;
      value: any;
    }[]
  >;
  TotalCaloriesBurned: (
    type: RecordType,
    startTime: string,
    endTime: string,
  ) => Promise<
    {
      total: any;
      value: number;
    }[]
  >;
  HeartRate: (
    type: RecordType,
    startTime: string,
    endTime: string,
  ) => Promise<
    {
      value: number;
    }[]
  >;
  ExerciseSession: (
    type: RecordType,
    startTime: string,
    endTime: string,
  ) => Promise<
    {
      value: number;
    }[]
  >;
};

export function sumValues(data: any) {
  return data?.reduce(
    (sum: number, {value}: {value: number}) => sum + value,
    0,
  );
}

export function getWeekdays(startDate: moment.Moment, endDate: moment.Moment) {
  let start = moment(startDate, 'YYYY-MM-DD');
  let end = moment(endDate, 'YYYY-MM-DD');
  let weekdays = [];
  for (let date = start; date.isSameOrBefore(end); date.add(1, 'days')) {
    weekdays.push({day: date.format('ddd'), date: date.format('YYYY-MM-DD')});
  }
  return weekdays;
}

export type returnType = {
  [key in types]: string;
};

type DateRange = {
  start: moment.Moment;
  end: moment.Moment;
};

type DateRanges = {
  W: DateRange;
  M: DateRange;
  '6M': DateRange;
  Y: DateRange;
};

export function getDateRanges(): DateRanges {
  const endMoment = moment().endOf('day');

  const startOfWeek = moment().startOf('day').clone().subtract(6, 'days');

  const startOfMonth = endMoment.clone().startOf('month');
  const endOfMonth = endMoment.clone().endOf('month');

  const startOfSixMonths = endMoment
    .clone()
    .subtract(6, 'months')
    .startOf('month');
  const endOfSixMonths = endMoment.clone().endOf('month');

  const startOfYear = endMoment.clone().startOf('year');
  const endOfYear = endMoment.clone().endOf('year');

  return {
    W: {
      start: startOfWeek,
      end: endMoment,
    },
    M: {
      start: startOfMonth,
      end: endOfMonth,
    },
    '6M': {
      start: startOfSixMonths,
      end: endOfSixMonths,
    },
    Y: {
      start: startOfYear,
      end: endOfYear,
    },
  };
}

export const typesList: types[] = !isIos
  ? ['Weight', 'Steps', 'TotalCaloriesBurned', 'HeartRate', 'ExerciseSession']
  : [
      'Weight',
      'Steps',
      'HeartRate',
      'ActiveEnergyBurned',
      'AppleStandTime',
      'AppleExerciseTime',
    ];
