import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Modal, ScrollView} from 'react-native';

function formatTimeToAmPm(dateStr) {
  // Convert string to Date object
  let dateObj = new Date(dateStr);

  // Get hours and minutes
  let hours = dateObj.getHours();
  let minutes = dateObj.getMinutes();

  // Format minutes to always be 2 digits
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // Determine AM/PM
  let ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert 24-hour time to 12-hour time
  hours = hours % 12;
  hours = hours ? hours : 12; // The hour '0' should be '12'

  return hours + ':' + minutes + ' ' + ampm;
}

const HealthAndroid = ({type, results}) => {
  const [open, setOpen] = useState(null);

  if (type === 'Steps') {
    return (
      <ScrollView>
        {results?.[0]?.total?.map?.(({count, date}) => {
          return (
            <TouchableOpacity
              style={{
                margin: 10,
                padding: 10,
                gap: 2,
                backgroundColor: 'aqua',
                borderRadius: 10,
              }}
              onPress={() => setOpen(date)}>
              <Text style={{fontSize: 12, fontWeight: 700}}>{date}</Text>
              <Text style={{fontSize: 15, fontWeight: 700}}>
                Steps: {count}
              </Text>
            </TouchableOpacity>
          );
        })}
        <Modal
          visible={!!open}
          onDismiss={() => setOpen(null)}
          onRequestClose={() => setOpen(null)}>
          <TouchableOpacity onPress={() => setOpen(null)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'aqua',
                padding: 20,
              }}>
              {'Close'}
            </Text>
          </TouchableOpacity>
          <ScrollView>
            {results?.[1]?.single?.map(({count, endTime}) => {
              const datePart = endTime.split('T')[0];

              if (datePart === open) {
                return (
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: '#faefef',
                      margin: 10,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'black',
                        marginBottom: 10,
                      }}>
                      {formatTimeToAmPm(endTime)}
                    </Text>
                    <Text
                      style={{fontSize: 12, fontWeight: 700, color: 'black'}}>
                      {' '}
                      {count}
                    </Text>
                  </View>
                );
              }
            })}
          </ScrollView>
        </Modal>
      </ScrollView>
    );
  }

  if (type === 'TotalCaloriesBurned') {
    return (
      <ScrollView>
        {results?.[0]?.total?.map?.(({count, date}) => {
          return (
            <TouchableOpacity
              style={{
                margin: 10,
                padding: 10,
                gap: 2,
                backgroundColor: 'aqua',
                borderRadius: 10,
              }}
              onPress={() => setOpen(date)}>
              <Text style={{fontSize: 12, fontWeight: 700}}>{date}</Text>
              <Text style={{fontSize: 15, fontWeight: 700}}>
                Energy: {count}
              </Text>
            </TouchableOpacity>
          );
        })}
        <Modal
          visible={!!open}
          onDismiss={() => setOpen(null)}
          onRequestClose={() => setOpen(null)}>
          <TouchableOpacity onPress={() => setOpen(null)}>
            <Text
              style={{
                fontSize: 16,
                fontWeight: 700,
                color: 'aqua',
                padding: 20,
              }}>
              {'Close'}
            </Text>
          </TouchableOpacity>
          <ScrollView>
            {results?.[1]?.single?.map(({energy, endTime}) => {
              const datePart = endTime.split('T')[0];

              if (datePart === open) {
                return (
                  <View
                    style={{
                      padding: 10,
                      backgroundColor: '#faefef',
                      margin: 10,
                      borderRadius: 10,
                    }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: 'black',
                        marginBottom: 10,
                      }}>
                      {formatTimeToAmPm(endTime)}
                    </Text>
                    <Text
                      style={{fontSize: 12, fontWeight: 700, color: 'black'}}>
                      {' '}
                      {energy.inKilocalories}
                    </Text>
                  </View>
                );
              }
            })}
          </ScrollView>
        </Modal>
      </ScrollView>
    );
  }

  if (type === 'Weight') {
    return results?.map(({value, time}) => {
      return (
        <View
          style={{
            margin: 10,
            padding: 10,
            gap: 2,
            backgroundColor: 'aqua',
            borderRadius: 10,
          }}>
          <Text style={{fontSize: 12, fontWeight: 700}}>
            {time.split('T')[0]}
          </Text>
          <Text style={{fontSize: 15, fontWeight: 700}}>Weight: {value}</Text>
        </View>
      );
    });
  }
  return (
    <>
      <Text>HealthAndroid</Text>
    </>
  );
};

export default React.memo(HealthAndroid);
