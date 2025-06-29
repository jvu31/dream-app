import { View, Image, Button, Text } from 'react-native';
import styles from 'styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Tag from '../components/tag';

export default function EntryView() {
  const test = () => {};
  return (
    <View>
      <View >
        {/* Icon for mood and day of the entry */}
        <View style={{ alignItems: 'center' }}>
          <FontAwesome name="smile-o" size={60} color="white" />
          <Text >Wed</Text>
        </View>
        {/* Content */}
        <View >
          <View >
            <Text >9:3r0 AM</Text>
            <Text >00:48s</Text>
          </View>
          <Tag tag={'Happy'} color1={'#0dff00'} color2={'#078500'} active={true} onPress={test} />
        </View>
      </View>
    </View>
  );
}
