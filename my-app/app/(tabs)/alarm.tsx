import { Text, View } from 'react-native';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Header from '../../components/header';
import AlarmView from 'components/alarmview';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import DateTimePicker from '@react-native-community/datetimepicker';
import { BlurView } from 'expo-blur'


import '../../global.css';

export default function AlarmScreen() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['1%', '80%'], []);
  const [time, setTime] = useState(new Date())

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

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View>
        <View
          style={{ backgroundColor: 'rgba(43, 36, 53, 0.5) ' }}>
          <Header />
          <AlarmView
            time={'9:30am'}
            days={['Sun', 'Sat']}
            active={true}
            id={0}
            openAlarm={openAlarm}
          />
          <AlarmView time={'10:30am'} days={[]} active={false} id={1} openAlarm={openAlarm} />
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
            <DateTimePicker mode="time" value={time} display="spinner"/>
            <Text>Awesome 🎉</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}
