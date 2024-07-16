/* eslint-disable react-native/no-inline-styles */
import React from 'react';

import {SvgXml} from 'react-native-svg';
import {SvgXML} from './svgXml';
import {View} from 'react-native';

function HomeIcon() {
  return (
    <View
      style={{
        backgroundColor: '#4157ff',
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <SvgXml xml={SvgXML.HomeWhite} height={15} width={15} />
    </View>
  );
}

export default HomeIcon;
