import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import useHealthData from './useHealthData';
import {getDateRanges, getWeekdays} from './utils';
import {BarChart} from 'react-native-chart-kit';
import {StackNavigationProp} from '@react-navigation/stack';

const graphType = ['D', 'W', 'M', '6M', 'Y'];

type RootStackParamList = {
  Detail: {type: string};
};

export type NavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

// Working on this....

const FilterData = ({route}) => {
  const [type, setType] = useState('W');
  const [graphData, setGraphData] = useState<number[]>([]);
  const [getHealthData, results] = useHealthData();
  const date = getDateRanges()[type];
  const weekdays = getWeekdays(date.start, date.end);
  console.log(results?.[route.params.type], 'here i am need');
  const getGraphData = () => {
    const data = weekdays.map(({date}) => {
      const steps = results?.[route.params.type]?.filter?.(({endDate}) => {
        return moment(endDate).utc().format('YYYY-MM-DD') === date;
      });

      if (route.params.type === 'HeartRate') {
        // If type is 'HeartRate', keep the last value
        return steps?.length ? Number(steps[steps.length - 1].value) : 0;
      } else {
        // Otherwise, sum the values
        const totalValue =
          steps?.reduce(
            (sum: number, step: {value: any}) => sum + Number(step.value),
            0,
          ) || 0;

        if (route.params.type === 'Weight') {
          // convert gram into kg
          return totalValue / 1000;
        }
        return totalValue;
      }
    });

    setGraphData(data);
  };

  useEffect(() => {
    if (results) {
      getGraphData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results]);

  useEffect(() => {
    getHealthData(route.params.type, date.start, date.end);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [route.params.type]);

  return (
    <SafeAreaView style={{alignItems: 'center'}}>
      <FlatList
        data={graphType}
        horizontal
        renderItem={({item}) => {
          const isActive = item === type;

          return (
            <TouchableOpacity
              style={[
                styles.itemContainer,
                {backgroundColor: isActive ? 'white' : 'grey'},
              ]}
              onPress={() => {
                setType(item);
              }}>
              <Text style={styles.itemText}>{item}</Text>
            </TouchableOpacity>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <Text>{route.params.type}</Text>
      {graphData.length > 0 && (
        <BarChart
          data={{
            labels: weekdays.map(({day}) => day),
            datasets: [
              {
                data: graphData,
              },
            ],
          }}
          width={Dimensions.get('window').width - 20} // from react-native
          height={400}
          yAxisLabel=""
          yAxisSuffix=""
          yAxisInterval={50}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          style={styles.graph}
        />
      )}
    </SafeAreaView>
  );
};

export default FilterData;

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 10,
    backgroundColor: 'grey',
    borderRadius: 6,
  },
  itemContainer: {
    overflow: 'hidden',
    paddingHorizontal: 10,
  },
  itemText: {
    padding: 10,
    textAlign: 'center',
  },
  graph: {
    marginVertical: 8,
    borderRadius: 8,
  },
});
