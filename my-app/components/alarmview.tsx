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

const Weekends = ['Sun', 'Sat'];
const Weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

function arraysMatch(a: string[], b: string[]) {
  if (a.length !== b.length) return false;

  const sortedA = [...a].sort();
  const sortedB = [...b].sort();

  return sortedA.every((value, index) => value === sortedB[index]);
}

export default function AlarmView({ time, days, active, id, openAlarm }: Props) {
  const [isEnabled, setIsEnabled] = useState(active);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  if (arraysMatch(days, Weekends)) {
    days = ['Weekends'];
  } else if (arraysMatch(days, Weekdays)) {
    days = ['Weekdays'];
  } else if (days.length === 7) {
    days = ['Everyday'];
  } else if (days.length === 8) {
    days = ['HOW DAFUQ DID YOU SPAWN A NEW DAY IN THE WEEK???'];
  }



  return (
    <TouchableOpacity
      onPress={() => openAlarm(id)}
      style={{ paddingBottom: 16, borderBottomWidth: 2, borderBottomColor: colors.text + '80' }}>
      {' '}
      {/* Dafuq thats how colors work? */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View>
          <Text style={[styles.h1, { opacity: isEnabled ? 1 : 0.5 }]}>{time}</Text>
        </View>
        <Switch
          trackColor={{ false: '#767577', true: '#5f4b6c' }}
          thumbColor={'#f4f3f4'}
          style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
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
