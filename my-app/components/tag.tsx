import { LinearGradient } from 'expo-linear-gradient';
import { View, Image, Button, Text } from 'react-native';
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
    <LinearGradient
      colors={[color1, color2]}
      className="w-20 rounded-full p-2"
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}>
      <Text className={styles.h5}>{tag}</Text>
    </LinearGradient>
  );
}
