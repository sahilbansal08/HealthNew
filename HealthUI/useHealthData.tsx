import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {healthMethods} from './iosHealthUtils';
import {androidHealthMethods} from './androidHealthUtils';
import {initialize} from 'react-native-health-connect';
import moment from 'moment';
import {AndroidTypes, IosTypes, types} from './utils';

const isIos = Platform.OS === 'ios';

type HealthDataHookReturn = [
  (type: types, startTime: string, endTime: string) => Promise<void>,
  Record<string, unknown>,
  boolean,
];

const useHealthData = (): HealthDataHookReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({});

  const getHealthData = async (
    type: types,
    startTime: string,
    endTime: string,
  ) => {
    setIsLoading(true);
    let res: unknown;
    if (isIos) {
      const options = {
        startDate: moment(startTime).toISOString(),
        endDate: moment(endTime).toISOString(),
        ascending: true,
      };
      res = await healthMethods[type as IosTypes](options);
    }
    if (!isIos) {
      // Android
      res = await androidHealthMethods[type as AndroidTypes](
        type as AndroidTypes,
        startTime,
        endTime,
      );
    }
    setIsLoading(false);
    setResults(prev => ({...prev, [type]: res}));
  };

  useEffect(() => {
    if (!isIos) {
      (async function () {
        await initialize();
      })();
    }
  }, []);
  return [getHealthData, results, isLoading];
};

export default useHealthData;
