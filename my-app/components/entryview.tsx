import { View, Image, Button, Text } from 'react-native';
import styles from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Tag from '../components/tag';

export default function EntryView() {
  const test = () => {};
  return (
    <View className="space-x-2 rounded-lg p-4" style={{ backgroundColor: 'rgba(43, 36, 53, 0.5)' }}>
      <View className="flex-row">
        {/* Icon for mood and day of the entry */}
        <View className="flex-col space-y-2" style={{ alignItems: 'center' }}>
          <FontAwesome name="smile-o" size={60} color="white" />
          <Text className={styles.h2}>Wed</Text>
        </View>
        {/* Content */}
        <View className="ml-4">
          <View className="flex-row justify-center">
            <Text className={styles.h2}>9:30 AM</Text>
            <Text className={`${styles.h4} opacity-50`}>00:48s</Text>
          </View>
          <Tag tag={'Happy'} color1={'#0dff00'} color2={'#078500'} active={true} onPress={test} />
        </View>
      </View>
    </View>
  );
}
