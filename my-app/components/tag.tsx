import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, Text, View } from 'react-native';
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
    <Pressable onPress={onPress}>
      <View className={`rounded-full overflow-hidden ${!active ? 'opacity-50' : ''}`}>
        <LinearGradient
          colors={[color1, color2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ alignItems: 'center', justifyContent: 'center' }}
        >
          <Text className={`${styles.h4} text-text py-2`}>{tag}</Text>
        </LinearGradient>
      </View>
    </Pressable>
  );
}
