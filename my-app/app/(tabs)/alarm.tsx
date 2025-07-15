import { Text, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../../components/header';
import AlarmView from 'components/alarmview';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import DatePicker from 'react-native-date-picker';
import { colors, styles } from '../../styles';
import { BlurView } from 'expo-blur';

import { fetchAllAlarms } from 'db/queries';

import '../../global.css';

export default function AlarmScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);
  const [time, setTime] = useState(new Date());
  const [alarms, setAlarms] = useState([]);

  const openAlarm = (_id: number) => {
    bottomSheetRef.current?.expand();
  };

  // Renders a backdrop that closes the sheet on press
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior="close"
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    []
  );

  // Fetches the list of alarms
  useEffect(() => {
    const alarmData = async () => {
      try {
        const data = await fetchAllAlarms();
        setAlarms(data);
      } catch (error) {
        console.error('Error fetching alarms:', error);
      }
    };

    alarmData();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, 0.5) ' }]}>
        <Header />
        <Text style={styles.h7}>Alarms</Text>
        {/* List of Alarms */}
        {alarms.map((alarm) => (
          <AlarmView
            key={alarm.alarm_id}
            time={alarm.time}
            days={alarm.days ? alarm.days.split(',') : []}
            active={alarm.active === 1}
            id={alarm.alarm_id}
            openAlarm={openAlarm}
          />
        ))}
      </View>
      {/* Bottom sheet for configuring alarm settings */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: 'rgba(43, 36, 53, 0.6)',
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }}>
        <BottomSheetView>
          <DatePicker date={time} onDateChange={setTime} mode="time" />
          <Text style={styles.h1}>Awesome</Text>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
