/* eslint-disable react/no-unstable-nested-components */
import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  // NativeEventEmitter,
  // NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Tab from './tab';
import appleHealthKit from 'react-native-health';
import {
  androidPermissions,
  iosPermissions,
  isIos,
  sumValues,
  types,
  typesList,
} from './utils';
import useHealthData from './useHealthData';
import moment from 'moment';
import {SvgXML} from './svgXml';
import {requestPermission} from 'react-native-health-connect';
import {SvgXml} from 'react-native-svg';
import DateBar from './DateBar';

const TabList = () => {
  const [date, setDate] = useState<string>(moment().toISOString());
  const now = moment(date).endOf('day');
  const [open, setOpen] = useState(false);
  const [getHealthData, results] = useHealthData();

  const startDate = now.clone().startOf('day');

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

  const getAllData = useCallback(() => {
    typesList.forEach(element => {
      getHealthData(element, startDate.toISOString(), now.toISOString());
    });
  }, [getHealthData, now, startDate]);

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

  const getAndroidData = () => {
    typesList.forEach(type => {
      getHealthData(type, startDate.toISOString(), now.toISOString());
    });
  };

  const checkAndroidHealthPermission = async () => {
    await requestPermission(androidPermissions);
    getAndroidData();
  };

  useEffect(() => {
    if (isIos) {
      getAllData();
      return;
    }
    getAndroidData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    initializeHealth();
    if (isIos) {
      checkIOSHealthPermission();
      return;
    }
    checkAndroidHealthPermission();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   if (isIos) {
  //     const listener = new NativeEventEmitter(
  //       NativeModules.AppleHealthKit,
  //     ).addListener('healthKit:HeartRate:new', async () => {
  //       console.log('--> observer triggered');
  //       getAllData();
  //     });
  //     return () => {
  //       listener.remove();
  //     };
  //   }
  // }, [getAllData]);

  const Item = ({item}: {item: types}) => {
    const data = results[item];
    return (
      <View style={styles.item}>
        <Tab
          value={
            item === 'HeartRate'
              ? data?.[data.length - 1]?.value
              : sumValues(data)
          }
          type={item}
          xml={SvgXML[item]}
        />
      </View>
    );
  };

  return (
    <View style={{paddingHorizontal: 24, paddingVertical: 20}}>
      <View style={styles.headerContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image
            source={{
              uri: 'https://assets.api.uizard.io/api/cdn/stream/f1849d56-733e-495f-ae65-dc1da3ad55ba.jpg',
            }}
            style={styles.img}
          />
          <Text style={styles.headerTitle}>Hello, Tony Stark! </Text>
        </View>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{marginLeft: 'auto'}}>
          <SvgXml xml={SvgXML.Calendar} height={30} width={30} />
        </TouchableOpacity>
      </View>
      <DatePicker
        modal
        open={open}
        date={new Date()}
        onConfirm={date => {
          setOpen(false);
          setDate(date.toISOString());
        }}
        onCancel={() => setOpen(false)}
        mode="date"
      />
      <View>
        <DateBar date={now} setDate={setDate} />
        <FlatList
          data={typesList}
          renderItem={({item}) => <Item item={item} />}
          keyExtractor={item => item}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      </View>
    </View>
  );
};

export default TabList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flex: 1,
    gap: 16,
  },
  item: {
    flex: 1,
    marginBottom: 24,
  },
  headerContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    color: '#030303',
    fontWeight: '600',
    marginLeft: 12,
  },
  img: {height: 40, width: 40, borderRadius: 20},
});
