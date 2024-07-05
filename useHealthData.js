import React, {useEffect, useState} from 'react';
import {Platform} from 'react-native';
import {healthMethods} from './iosHealthUtils';
import {androidHealthMethods} from './androidHealthUtils';
import {initialize} from 'react-native-health-connect';

const isIos = Platform.OS === 'ios';

const useHealthData = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState({});

  const getHealthData = async (type, startTime, endTime) => {
    setIsLoading(true);
    let res = {};
    if (isIos) {
      const options = {
        startDate: new Date(startTime).toISOString(),
        endDate: new Date(endTime).toISOString(),
        ascending: false,
      };
      res = await healthMethods[type](options);
    }
    if (!isIos) {
      // Android
      res = await androidHealthMethods[type](type, startTime, endTime);
    }
    setIsLoading(false);
    setResults(prev => ({...prev, [type]: res}));
  };

  useEffect(() => {
    (async function () {
      await initialize();
    })();
  }, []);
  return [getHealthData, results, isLoading];
};

export default useHealthData;
