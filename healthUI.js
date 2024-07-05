/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import {
  StyleSheet,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  LogBox,
  Platform,
  Dimensions,
  NativeEventEmitter,
  NativeModules,
} from 'react-native';
import appleHealthKit from 'react-native-health';
import useHealthData from './useHealthData';
import {requestPermission, initialize} from 'react-native-health-connect';

import Chip from './chip';
import {LineChart} from 'react-native-gifted-charts';
import HealthAndroid from './HealthAndroid';
import BackgroundFetch from 'react-native-background-fetch';

const isIos = Platform.OS === 'ios';

const iosPermissions = {
  permissions: {
    read: ['SleepAnalysis', 'Weight', 'HeartRate', 'BodyMassIndex', 'Height','Steps'],
    write: [],
  },
};

const androidPermissions = [
  {
    accessType: 'read',
    recordType: 'Steps',
  },
  {
    accessType: 'read',
    recordType: 'Weight',
  },
  {
    accessType: 'read',
    recordType: 'HeartRate',
  },
  {
    accessType: 'read',
    recordType: 'ActiveCaloriesBurned',
  },
];
function formatDate(date) {
  let day = date.getDate();
  let month = date.getMonth() + 1;
  let year = date.getFullYear();

  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;

  year = year.toString().slice(-2);

  return `${day}-${month}-${year}`;
}

const HealthUI = () => {
  const [getHealthData, results] = useHealthData();
  const [type, setType] = useState('Weight');
  let currentDate = new Date();
  currentDate.setDate(currentDate.getDate() - 1000);

  let presentDate = new Date();
  presentDate.setDate(presentDate.getDate());


  const initializeHealth = async () => {
    if (isIos) {
      appleHealthKit.initHealthKit(iosPermissions, error => {
        if (!error) {
          getAllData();
        }
      });
      return;
    }
  };

  const types = !isIos
    ? ['Weight', 'Steps', 'TotalCaloriesBurned']
    : [
        'Weight',
        'Steps',
        'HeartRate',
        'SleepSession',
        'Height',
        'BodyMassIndex',
      ];

  const units = {
    Weight: 'Kg',
    HeartRate: 'bpm',
    Height: 'inch',
  };

  const data = results[type];

  const charData = data?.map?.(({value, endDate, time}) => {
    return {
      label: formatDate(new Date(endDate || time)),
      value,
    };
  }) || [{label: '', value: 0}];

  const getAllData = () => {
    types.forEach(element => {
      getHealthData(
        element,
        currentDate.toISOString(),
        new Date().toISOString(),
      );
    });
  };

  const getAndroidData = () => {
    // types.map
    getHealthData(
      'Steps',
      currentDate.toISOString(),
      presentDate.toISOString(),
    );
    getHealthData(
      'TotalCaloriesBurned',
      currentDate.toISOString(),
      presentDate.toISOString(),
    );
    getHealthData(
      'Weight',
      currentDate.toISOString(),
      presentDate.toISOString(),
    );
  };

  const checkIOSHealthPermission = async () => {
    appleHealthKit.getAuthStatus(iosPermissions, (error, res) => {
      if (error) {
        return;
      }
      if (res?.permissions?.read?.includes(0)) {
        initializeHealth();
        return;
      }
      getAllData();
    });
  };

  const checkAndroidHealthPermission = async () => {
    await requestPermission(androidPermissions);
  };

  const renderXAxisLabel = (value, index) => {
    return (
      <View style={styles.xAxisLabelContainer}>
        <Text style={styles.xAxisLabel}>{value}</Text>
      </View>
    );
  };

  // const configureBackgroundFetch = () => {
  //   console.log('[BackgroundFetch] taskId: ', "taskId");

  //   BackgroundFetch.configure(
  //     {
  //       minimumFetchInterval: 1,
  //       requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY
  //       // Fetch interval in minutes
  //     },
  //     async (taskId) => {
  //       console.log('[BackgroundFetch] taskId: ', taskId);
  
  //       try {
  //         const stepCountData = await getAndroidData();
  //         console.log('Fetched step count data: ', stepCountData);
  //         // You can store or process the fetched data here
  //       } catch (error) {
  //         console.error('Error fetching step count data: ', error);
  //       }
  
  //       BackgroundFetch.finish(taskId);
  //     },
  //     (error) => {
  //       console.log('[BackgroundFetch] failed to start: ', error);
  //     }
  //   );
  
  //   // Optional: Query the status of BackgroundFetch.
  //   BackgroundFetch.status((status) => {
  //     switch (status) {
  //       case BackgroundFetch.STATUS_RESTRICTED:
  //         console.log('BackgroundFetch restricted');
  //         break;
  //       case BackgroundFetch.STATUS_DENIED:
  //         console.log('BackgroundFetch denied');
  //         break;
  //       case BackgroundFetch.STATUS_AVAILABLE:
  //         console.log('BackgroundFetch is enabled and available');
  //         break;
  //     }
  //   });
  // };

  useEffect(() => {
    initializeHealth();
    if (isIos) {
      checkIOSHealthPermission();
      return;
    }
    checkAndroidHealthPermission();
    getAndroidData();
    // configureBackgroundFetch();
    LogBox.ignoreLogs(['Warning: ...']);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    new NativeEventEmitter(NativeModules.AppleHealthKit).addListener(
      'healthKit:HeartRate:new',
      async () => {
        console.log('--> observer triggered');
        getAllData();
      },
    );
  });

  return (
    <SafeAreaView style={{margin: 10, flex: type === 'BodyMassIndex' ? 0 : 1}}>
      <ScrollView contentContainerStyle={{flexDirection: 'row', gap: 10, paddingBottom:20}} horizontal showsHorizontalScrollIndicator={false}>
        {types.map(title => {
          const isClicked = type === title;

          return (
            <Chip
              title={title}
              onPress={() => {
                setType(title);
              }}
              isClicked={isClicked}
            />
          );
        })}
      </ScrollView>

      {type === 'Weight' && (
        <LineChart
          data={charData}
          areaChart
          yAxisLabel="Date"
          xAxisLabel="Values"
          width={Dimensions.get('screen').width}
          xAxisLabelComponent={renderXAxisLabel}
        />
      )}

      {!isIos ? (
        <HealthAndroid type={type} results={data} />
      ) : (
        <>
          <Text style={{fontWeight: 700, fontSize: 20, marginTop: 10}}>
            List:
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            bounces={false}
            style={{
              backgroundColor: 'white',
              padding: 10,
              margin: 10,
              borderRadius: 6,
            }}>
            {Array.isArray(data) ? (
              data?.map?.(({value, startDate, endDate}) => {
                return (
                  <View
                    style={{
                      backgroundColor: '#FF7A7A',
                      padding: 10,
                      margin: 10,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: 10,
                        color: '#003E74',
                        fontWeight: 600,
                      }}>
                      {type === "SleepSession" ? value : Math.floor(value)} {units[type]}
                    </Text>
                    <Text style={{fontSize: '28', fontWeight: 700}}>
                      Start Date:
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: 10,
                        color: '#003E74',
                        fontWeight: 600,
                      }}>
                      {formatDate(new Date(startDate))}
                    </Text>
                    <Text style={{fontSize: '28', fontWeight: 700}}>
                      End Date:
                    </Text>

                    <Text
                      style={{
                        fontSize: 15,
                        marginBottom: 10,
                        color: '#003E74',
                        fontWeight: 600,
                      }}>
                      {formatDate(new Date(endDate))}
                    </Text>
                  </View>
                );
              })
            ) : (
              <View
                style={{
                  backgroundColor: '#FF7A7A',
                  padding: 10,
                  margin: 10,
                  borderRadius: 10,
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    marginBottom: 10,
                    color: '#003E74',
                    fontWeight: 600,
                  }}>
                  {data?.value} {units[type]}
                </Text>
              </View>
            )}
          </ScrollView>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  xAxisLabelContainer: {
    width: 60,
    alignItems: 'center',
  },
  xAxisLabel: {
    color: '#ffffff',
    fontSize: 12,
  },
});

export default HealthUI;
