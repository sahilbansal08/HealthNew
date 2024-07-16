/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function getSurroundingDays(date: moment.Moment) {
  const inputDate = date ? moment(date) : moment();
  const result = [];

  for (let i = -2; i <= 2; i++) {
    const tempDate = inputDate.clone().add(i, 'days');
    const fullDate = tempDate.format('YYYY-MM-DD');
    const dayName = tempDate.format('ddd');
    const dayDate = tempDate.date();

    result.push({fullDate, date: dayDate, dayName});
  }

  return result;
}

interface DateBarProps {
  date: moment.Moment;
  setDate: React.Dispatch<React.SetStateAction<string>>;
}

const DateBar = ({date, setDate}: DateBarProps) => {
  const current = moment(date).format('YYYY-MM-DD');
  const list = getSurroundingDays(date);
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        marginVertical: 32,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      {list.map(({date, dayName, fullDate}, index) => {
        const isActive = fullDate === current;

        return (
          <View style={styles.container}>
            <TouchableOpacity
              style={{marginLeft: 20}}
              onPress={() => setDate(fullDate)}>
              <Text
                style={[
                  styles.dateTitle,
                  {color: isActive ? '#4157ff' : 'black'},
                ]}>
                {date}
              </Text>
              <Text
                style={[
                  styles.dayTitle,
                  {color: isActive ? '#4157ff' : '#757893'},
                ]}>
                {dayName}
              </Text>
            </TouchableOpacity>
            <View style={[styles.divider, {width: index !== 4 ? 1 : 0}]} />
          </View>
        );
      })}
    </View>
  );
};

export default DateBar;

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: 20},
  dateTitle: {
    fontWeight: '700',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'center',
  },
  dayTitle: {
    lineHeight: 16,
    fontSize: 12,
  },
  divider: {
    height: 32,
    backgroundColor: '#e1e3eb',
    borderRadius: 1,
  },
});
