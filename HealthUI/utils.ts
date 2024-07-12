import {Platform} from 'react-native';
import {HealthKitPermissions, HealthPermission} from 'react-native-health';
import {
  Permission,
  RecordType,
} from 'react-native-health-connect/lib/typescript/types';
import {Options} from '../iosHealthUtils';

const readAccessType = 'read';

export const iosPermissions: HealthKitPermissions = {
  permissions: {
    read: [
      HealthPermission.Weight,
      HealthPermission.HeartRate,
      HealthPermission.Steps,
      HealthPermission.AppleExerciseTime,
      HealthPermission.AppleExerciseTime,
      HealthPermission.ActiveEnergyBurned,
    ],
    write: [],
  },
};

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

export const types = !isIos
  ? ['Weight', 'Steps', 'TotalCaloriesBurned', 'HeartRate', 'ExerciseSession']
  : [
      'Weight',
      'Steps',
      'HeartRate',
      'ActiveEnergyBurned',
      'AppleStandTime',
      'AppleExerciseTime',
    ];
