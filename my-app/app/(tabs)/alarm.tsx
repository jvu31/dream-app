import { Text, View } from 'react-native';
import Header from '../../components/header';
import AlarmView from 'components/alarmview';

import '../../global.css';

export default function AlarmScreen() {
  return (
    <View className="relative flex-1 bg-black">
      <View className="flex-1 space-y-4 px-8" style={{ backgroundColor: 'rgba(43, 36, 53, 0.5) ' }}>
        <Header/>
        <AlarmView time={"9:30am"} days={["Sun", "Sat"]} active={true} id={0}/>
                <AlarmView time={"9:30am"} days={[]} active={false} id={0}/>

      </View>
    </View>
  );
}
