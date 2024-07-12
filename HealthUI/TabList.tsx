import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  NativeEventEmitter,
  NativeModules,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import Tab from './tab';
import appleHealthKit from 'react-native-health';
import {androidPermissions, iosPermissions, isIos, types} from './utils';
import useHealthData from '../useHealthData';
import moment from 'moment';
import {SvgXML} from './svgXml';
import {requestPermission} from 'react-native-health-connect';
import {SvgXml} from 'react-native-svg';

const TabList = () => {
  const [date, setDate] = useState<moment.Moment>(moment());
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
    types.forEach(element => {
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
    types.forEach(type => {
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
      // writeStandTime(11, new Date().toISOString());
      return;
    }
    getAndroidData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  useEffect(() => {
    initializeHealth();
    if (isIos) {
      checkIOSHealthPermission();
      // requestAuthorization();
      return;
    }
    checkAndroidHealthPermission();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isIos) {
      const listener = new NativeEventEmitter(
        NativeModules.AppleHealthKit,
      ).addListener('healthKit:HeartRate:new', async () => {
        console.log('--> observer triggered');
        getAllData();
      });
      return () => {
        listener.remove();
      };
    }
  }, [getAllData]);

  const Item = ({item}) => {
    const data = results[item];

    return (
      <View style={styles.item}>
        <Tab value={data?.[0]?.value} type={item} xml={SvgXML[item]} />
      </View>
    );
  };

  return (
    <View>
      <View
        style={{
          backgroundColor: 'white',
          padding: 10,
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <Text style={{fontSize: 22, color: 'black', fontWeight: '700'}}>
          Welcome!
        </Text>
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
        <FlatList
          data={types}
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
    padding: 10,
  },
  row: {
    flex: 1,
  },
  item: {
    flex: 1,
    margin: 15,
  },
});
