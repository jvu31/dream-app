import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View, TouchableOpacity } from 'react-native';
import styles from 'styles';

interface Props {
  tag: string;
  color1: string;
  color2: string;
  active: boolean;
  onPress: () => void;
}

export default function Tag({ tag, color1, color2, active, onPress }: Props) {
  return (
    <TouchableOpacity onPress={onPress} style={{borderRadius: 10}}>
      <View>
        <LinearGradient
          colors={[color1, color2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 3 }}
        >
          <Text style={styles.h4}>{tag}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}
