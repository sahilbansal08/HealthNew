import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {modifyValue, title, types, units} from './utils';
import {useNavigation} from '@react-navigation/native';
import {NavigationProp} from './FilterData';

export interface TabProps {
  type: types;
  value: number;
  xml: string;
}

const Tab = ({type, value, xml}: TabProps) => {
  const navigation = useNavigation<NavigationProp>();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('Detail', {type})}>
      <Text style={styles.title}>{title[type] || type}</Text>
      <View style={styles.subContainer}>
        <View style={{flex: 1}}>
          <Text style={styles.value}>{modifyValue(type, value)}</Text>
          <Text style={styles.unitText}>{units[type]}</Text>
        </View>
        <View style={{justifyContent: 'center'}}>
          <View style={styles.iconContainer}>
            <SvgXml xml={xml} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Tab;

const styles = StyleSheet.create({
  title: {fontWeight: '600', fontSize: 16, color: '#030303', lineHeight: 24},
  subContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#efeffe',
    paddingVertical: 24,
    paddingHorizontal: 28,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: 'white',
  },
  value: {fontWeight: '600', color: '#000000', fontSize: 24, lineHeight: 31},
  iconContainer: {
    padding: 4,
    backgroundColor: '#f6f7fb',
    borderRadius: 8,
  },
  unitText: {color: 'rgba(9,15,71,0.8)', fontSize: 14, lineHeight: 20},
});
