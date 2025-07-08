import { LinearGradient } from 'expo-linear-gradient';
import { Text, View, TouchableOpacity } from 'react-native';
import styles from 'styles';

interface Props {
  tag: string;
  color1: string;
  active: boolean;
  onPress: () => void;
}

export default function Tag({ tag, color1, active, onPress }: Props) {
  function darkenHexColor(hex, factor) {
    return (
      '#' +
      [1, 3, 5]
        .map((i) => {
          const channel = parseInt(hex.substr(i, 2), 16);
          const darker = Math.round(channel * (1 - factor));
          return darker.toString().padStart(2, '0');
        })
        .join('')
    );
  }
  if (!color1) {
    return (
      <TouchableOpacity onPress={onPress}>
        <View
          style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 3 }}>
          <Text style={[styles.h4, {opacity: .5}]}>{tag}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity onPress={onPress} style={{ borderRadius: 10 }}>
      <View>
        <LinearGradient
          colors={[color1, darkenHexColor(color1, 0.7)]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ alignItems: 'center', justifyContent: 'center', borderRadius: 10, padding: 3 }}>
          <Text style={styles.h4}>{tag}</Text>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}
