import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {modifyValue, title, types, units} from './utils';

export interface TabProps {
  type: types;
  value: number;
  xml: string;
}

const Tab = ({type, value, xml}: TabProps) => {
  return (
    <React.Fragment>
      <Text style={styles.title}>{title[type] || type}</Text>
      <View style={styles.subContainer}>
        <View style={{flex: 1, paddingLeft: 25}}>
          <Text style={styles.value}>{modifyValue(type, value)}</Text>
          <Text style={{color: 'grey'}}>{units[type]}</Text>
        </View>
        <View style={{flex: 1, paddingLeft: 10}}>
          <SvgXml xml={xml} width={40} height={40} />
        </View>
      </View>
    </React.Fragment>
  );
};

export default Tab;

const styles = StyleSheet.create({
  title: {fontWeight: '700', fontSize: 16, color: 'black'},
  subContainer: {
    flexDirection: 'row',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    paddingVertical: 20,
    overflow: 'hidden',
    marginTop: 10,
    backgroundColor: 'white',
  },
  value: {fontWeight: '700', color: 'black', fontSize: 24},
});
