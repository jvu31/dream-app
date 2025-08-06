import { Text, TouchableOpacity, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../../components/header';
import AlarmView from 'components/alarmview';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors, styles } from '../../styles';
import DatePicker from 'react-native-date-picker';
import { AlarmModel } from 'db/interfaces';

import { editAlarm, fetchAllAlarms } from 'db/queries';

import '../../global.css';
import { parseTimeToDate, removeSeconds } from 'components/utils';

const defaultAlarm: AlarmModel = {
  alarm_id: -1,
  time: new Date().toISOString(),
  days: '',
  snooze: 0,
  active: 0,
  ringtone_id: -1,
};

export default function AlarmScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['80%'], []);
  const [currentAlarm, setCurrentAlarm] = useState<AlarmModel>(defaultAlarm);
  const [alarms, setAlarms] = useState<AlarmModel[]>([]);

  // Opens alarm's bottomsheet
  const openAlarm = (id: number) => {
    // Sets the current alarm to whatever the id is, defaults the alarm to null if user is trying to make new alarm
    if (id !== -1) {
      setCurrentAlarm(alarms.find((alarm) => alarm.alarm_id === id));
    }
    bottomSheetRef.current?.expand();
  };

  // Changes the time of the alarm
  const onTimeChange = async (time: Date) => {
    editAlarm(currentAlarm.alarm_id, removeSeconds(time.toLocaleTimeString()), 'time');
    setCurrentAlarm({ ...currentAlarm, time: removeSeconds(time.toLocaleTimeString()) });
  };

  // Changes the days of the week for the alarm
  const onDayChange = async (day: string) => {
    // Case where user wants to remove the day
    if (currentAlarm.days.includes(day)) {
      setCurrentAlarm({
        ...currentAlarm,
        days: currentAlarm.days.replace(day, ''),
      });
      // Case where user wants to add the day
    } else {
      setCurrentAlarm({
        ...currentAlarm,
        days: currentAlarm.days + day + ',',
      });
    }
    await editAlarm(currentAlarm.alarm_id, currentAlarm.days, 'days');
  }

  // Changes the alarm sound of the alarm

  // Changes the snooze of the alarm

  // Deletes the alarm

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
  }, [currentAlarm]);

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
          <View style={{ alignItems: 'center' }}>
            <DatePicker
              date={new Date(parseTimeToDate(currentAlarm.time))}
              onDateChange={onTimeChange}
              mode="time"
              theme="dark"
            />
          </View>
          <View style={{ paddingHorizontal: 18, gap: 8 }}>
            {/* Days of the week */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {[
                { day: 'Sun', letter: 's' },
                { day: 'Mon', letter: 'm' },
                { day: 'Tue', letter: 't' },
                { day: 'Wed', letter: 'w' },
                { day: 'Thu', letter: 't' },
                { day: 'Fri', letter: 'f' },
                { day: 'Sat', letter: 's' },
              ].map((day) => (
                <TouchableOpacity
                  key={day.day}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: currentAlarm.days.includes(day.day)
                      ? colors.accent
                      : 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {onDayChange(day.day)}}>
                  <Text style={styles.h3}>{day.letter.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.h1}>Awesome</Text>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}
