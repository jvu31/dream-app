import { Modal, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../../components/header';
import AlarmView from 'components/alarmview';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { colors, styles } from '../../styles';
import DatePicker from 'react-native-date-picker';
import { AlarmModel, RingtoneModel } from 'db/interfaces';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { addAlarm, editAlarm, fetchAllAlarms, fetchRingtone, removeAlarm } from 'db/queries';

import '../../global.css';
import { parseTimeToDate, removeSeconds } from 'components/utils';
import ConfirmModal from 'components/confirmmodal';
import { FloatingAction, IActionProps } from 'react-native-floating-action';
import { router } from 'expo-router';

const defaultAlarm: AlarmModel = {
  alarm_id: -1,
  time: new Date().toISOString(),
  days: '',
  snooze: 0,
  active: 0,
  ringtone_id: -1,
};

const DayOrder = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AlarmScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['82%'], []);
  const [currentAlarm, setCurrentAlarm] = useState<AlarmModel>(defaultAlarm);
  const [currentRingtone, setCurrentRingtone] = useState<RingtoneModel>();
  const [currentDays, setCurrentDays] = useState<string[]>([]);
  const [alarms, setAlarms] = useState<AlarmModel[]>([]);
  const [modal, setModal] = useState(false);

  // Opens alarm's bottomsheet
  const openAlarm = async (id: number) => {
    bottomSheetRef.current?.expand();
    let alarmToOpen = defaultAlarm;

    if (id !== -1) {
      const found = alarms.find((alarm) => alarm.alarm_id === id);
      if (found) {
        alarmToOpen = found;
      }
    } else {
      alarmToOpen = defaultAlarm;
    }

    setCurrentAlarm(alarmToOpen);
    setCurrentDays(alarmToOpen.days ? alarmToOpen.days.split(',') : []);

    if (alarmToOpen.ringtone_id !== -1) {
      const ringtone = await fetchRingtone(alarmToOpen.ringtone_id);
      setCurrentRingtone(ringtone);
    } else {
      setCurrentRingtone(undefined);
    }
  };

  // Changes the time of the alarm
  const onTimeChange = async (time: Date) => {
    editAlarm(currentAlarm.alarm_id, removeSeconds(time.toLocaleTimeString()), 'time');
    setCurrentAlarm({ ...currentAlarm, time: removeSeconds(time.toLocaleTimeString()) });
  };

  // Changes the days of the week for the alarm
  const onDayChange = async (day: string) => {
    let updatedDays: string[];

    if (currentDays.includes(day)) {
      // Remove the day
      updatedDays = currentDays.filter((d) => d !== day);
    } else {
      // Add the day
      updatedDays = [...currentDays, day];
    }

    updatedDays = updatedDays.sort((a, b) => DayOrder.indexOf(a) - DayOrder.indexOf(b));

    const dayData = updatedDays.join(',');

    setCurrentDays(updatedDays);
    setCurrentAlarm({ ...currentAlarm, days: dayData });
    await editAlarm(currentAlarm.alarm_id, dayData, 'days');
  };

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

  // Open delete modal
  const deleteAlarm = async () => {
    await removeAlarm(currentAlarm.alarm_id);
    let newAlarms = [];
    alarms.forEach((alarm) => {
      if (alarm.alarm_id !== currentAlarm.alarm_id) {
        newAlarms.push(alarm);
      }
    });
    setAlarms(newAlarms);
    bottomSheetRef.current?.close();
    setModal(false);
  };

  // Options for floating action button
  const actions: IActionProps[] = [
    {
      name: 'bt_add_entry',
      text: 'Add Entry',
      color: colors.accent,
      icon: <FontAwesome name="plus" size={20} color={colors.text} />,
    },
    {
      name: 'bt_add_alarm',
      text: 'Add Alarm',
      color: colors.accent,
      icon: <FontAwesome name="bell" size={20} color={colors.text} />,
    },
  ];

  // Actions for each floating action option
  const handleFloatingActionPress = (name?: string) => {
    switch (name) {
      // Add a new entry
      case 'bt_add_entry':
        console.log('Add entry');
        // New entry id is initially -1, changes to actual id when user makes a change, and pushes to the entries page
        router.push(`entry/${-1}`);
        break;
      // Add a new alarm
      case 'bt_add_alarm':
        console.log('Add alarm');
        setCurrentAlarm(defaultAlarm);
        bottomSheetRef.current?.expand();
        break;
    }
  };

  // Add new alarm
  const addNewAlarm = async () => {
    const newAlarmArray = await addAlarm({
      time: currentAlarm.time,
      days: currentAlarm.days,
      snooze: currentAlarm.snooze,
      active: 1,
      ringtone_id: currentAlarm.ringtone_id,
    })

    const newAlarm = Array.isArray(newAlarmArray) ? newAlarmArray[0] : newAlarmArray;
    setAlarms([...alarms, newAlarm]);
    setCurrentAlarm(defaultAlarm);
  }


  
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.container, { backgroundColor: 'rgba(43, 36, 53, .5) ' }]}>
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
          backgroundColor: 'rgba(43, 36, 53, 1)',
        }}
        handleIndicatorStyle={{
          backgroundColor: 'rgba(255, 255, 255, 1)',
        }}
        onChange={(index) => {
          if (index === -1 && currentAlarm.alarm_id === -1) {
            addNewAlarm();
          }
        }}
        >
        <BottomSheetView>
          <View
            style={{
              alignItems: 'center',
              transform: [{ scale: 1.5 }],
              marginTop: 50,
              marginBottom: 80,
            }}>
            <DatePicker
              date={new Date(parseTimeToDate(currentAlarm.time))}
              onDateChange={onTimeChange}
              mode="time"
              theme="dark"
            />
          </View>
          <View style={{ paddingHorizontal: 18, gap: 18 }}>
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
                    backgroundColor: currentDays.includes(day.day)
                      ? colors.accent
                      : 'rgba(255,255,255,0.1)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={() => {
                    onDayChange(day.day);
                  }}>
                  <Text style={styles.h3}>{day.letter.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ gap: 8, paddingHorizontal: 16 }}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={[styles.h1, { opacity: 0.5 }]}>Sounds</Text>
                <Text style={[styles.h3, { fontWeight: '600' }]}>
                  {currentRingtone ? currentRingtone.track : 'None'}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={[styles.h1, { opacity: 0.5 }]}>Snooze</Text>
                <Switch
                  trackColor={{ false: '#767577', true: '#5f4b6c' }}
                  thumbColor={'#f4f3f4'}
                  style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
                  value={currentAlarm.snooze > 0}
                  onValueChange={async (value) => {
                    const snoozeValue = value ? 5 : 0;
                    setCurrentAlarm({ ...currentAlarm, snooze: snoozeValue });
                    await editAlarm(currentAlarm.alarm_id, snoozeValue, 'snooze');
                  }}
                />
              </View>
              <TouchableOpacity
                style={{
                  alignSelf: 'center',
                  alignItems: 'center',
                  backgroundColor: colors.accent,
                  paddingVertical: 6,
                  paddingHorizontal: 50,
                  borderRadius: 15,
                }}
                onPress={() => setModal(true)}>
                <Text style={styles.h3}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
      <FloatingAction
        actions={actions}
        onPressItem={handleFloatingActionPress}
        distanceToEdge={{ vertical: 110, horizontal: 30 }}
        color={colors.accent}
        shadow={{ shadowOpacity: 0, shadowRadius: 0 }}
        overlayColor="rgba(0, 0, 0, .6)"
      />
      <ConfirmModal
        visible={modal}
        text={'Are you sure you want to delete this alarm?'}
        onClose={() => setModal(false)}
        onConfirm={deleteAlarm}
      />
    </GestureHandlerRootView>
  );
}
