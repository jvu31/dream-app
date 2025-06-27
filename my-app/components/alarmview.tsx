import { View, Text, Switch } from 'react-native';
import styles from 'styles';
import { useState } from 'react';

interface Props {
  time: string;
  days: string[];
  active: boolean;
  id: number;
}

export default function AlarmView({ time, days, active, id }: Props) {
  const [isEnabled, setIsEnabled] = useState(active);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  return (
    <View className="border-b border-text/50 py-8">
      <View className="flex-row items-center justify-between">
        <View>
          <Text className={`${styles.h1} text-text transition-opacity duration-300 ${!isEnabled && 'opacity-50'}`}>{time}</Text>
          {days && days.length > 0 && (
            <Text className={`${styles.h5} text-text/50`}>
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
    </View>
  );
}
