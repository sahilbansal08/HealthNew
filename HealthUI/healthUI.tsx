import React from 'react';

import {SafeAreaView} from 'react-native';

import TabList from './TabList';

const HealthUI = () => {
  return (
    <SafeAreaView style={{backgroundColor: '#f6f7fb', flex: 1}}>
      <TabList />
    </SafeAreaView>
  );
};

export default HealthUI;
