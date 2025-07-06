import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { styles, colors } from 'styles';
import { useState, useEffect } from 'react';

interface Props {
  time: string;
  days: string[];
  active: boolean;
  id: number;
  openAlarm: (id: number) => void;
}

export default function AlarmView({ time, days, active, id, openAlarm }: Props) {
  const [isEnabled, setIsEnabled] = useState(active);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  
  return (
    <TouchableOpacity
      onPress={() => openAlarm(id)}
      style={{ paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: colors.text + '80' }}> {/* Dafuq thats how colors work? */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={styles.h1}>{time}</Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#5f4b6c' }}
          thumbColor={'#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
      {days && days.length > 0 && (
        <Text style={[styles.h5, { opacity: 0.5 }]}>{days.join(', ')}</Text>
      )}
    </TouchableOpacity>
  );
}
