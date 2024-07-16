import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';

import HealthUI from './HealthUI/healthUI';
import FilterData from './HealthUI/FilterData';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {SvgXml} from 'react-native-svg';
import {SvgXML} from './HealthUI/svgXml';
import HomeIcon from './HealthUI/HomeIcon';
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function HomeStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HealthUI} />
      <Stack.Screen name="Detail" component={FilterData} />
    </Stack.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({route}) => ({
          headerShown: false,
          tabBarIcon: ({focused, color, size}) => {
            return <HomeIcon/>;
          },
          tabBarStyle: {
            backgroundColor: '#f6f7fb',
            paddingBottom: 12,
            height: 60,
            borderTopWidth: 0,
          },
          tabBarShowLabel: false,
        })}>
        <Tab.Screen name="Home" component={HomeStackNavigator} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;
