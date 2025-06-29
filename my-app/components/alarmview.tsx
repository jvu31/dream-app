import { View, Text, Switch, TouchableOpacity } from 'react-native';
import styles from 'styles';
import { useState } from 'react';

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
    <TouchableOpacity  onPress={() => openAlarm(id)}>
      <View >
        <View>
          <Text >{time}</Text>
          {days && days.length > 0 && (
            <Text >
              {days.join(', ')}
            </Text>
          )}
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#5f4b6c' }}
          thumbColor={'#f4f3f4'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </TouchableOpacity>
  );
}
