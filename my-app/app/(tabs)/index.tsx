import { Text, View, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import '../../global.css';
import styles from '../../styles'


export default function Home() {

  
  return (
    <View className={styles.container} style={{ backgroundColor: 'rgba(43, 36, 53, 0.5) ' }}>
      <Text className={styles.h1}>June 2025</Text>
      <Text className={`${styles.h2} opacity-50`}>June 25, 2025</Text>
      <Text className={`${styles.h3} opacity-50`}>So today I woke feeling like</Text>
      <Text className={`${styles.h4} opacity-50`}>So today I woke feeling like</Text>
    </View>
  );
}
