import React from 'react';

import {SafeAreaView} from 'react-native';

import TabList from './HealthUI/TabList';

const HealthUI = () => {
  return (
    <SafeAreaView style={{backgroundColor: '#f7f7f7', flex: 1}}>
      <TabList />
    </SafeAreaView>
  );
};

export default HealthUI;
