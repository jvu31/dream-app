import { Text, View, SafeAreaView, Image, Button } from 'react-native';
import '../../global.css';
import styles from '../../styles';

export default function Home() {
  const test = () => {};

  return (
    <SafeAreaView className="relative flex-1 bg-black">
      <View
        className="mt-10 flex-1 px-8"
        style={{ backgroundColor: 'rgba(43, 36, 53, 0.5) ' }}>
        <View className="flex flex-col items-center">
          <Image
            source={require('../../assets/icon.png')}
            className="rounded-lg"
            style={{ width: 80, height: 80, borderRadius: 20 }}
          />
          <View className="ml-auto">
            <Button title="test" onPress={test} />
          </View>
        </View>
        <Text className={styles.h1} allowFontScaling={false}>
          June 2025
        </Text>
        <Text className={`${styles.h2} opacity-50`}>June 25, 2025</Text>
        <Text className={`${styles.h5} opacity-50`}>So today I woke feeling like shit man</Text>
        <Text className={`${styles.h4} opacity-50`}>So today I wokefdsfsd feeling like</Text>
      </View>
    </SafeAreaView>
  );
}
