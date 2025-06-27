import { Text, View } from 'react-native';
import '../../global.css';
import styles from '../../styles';
import Header from '../../components/header';
import EntryView from 'components/entryview';

export default function Home() {
  const test = () => {};

  return (
    <View className="relative flex-1 bg-black">
      <View className="flex-1 px-8 space-y-4" style={{ backgroundColor: 'rgba(43, 36, 53, 0.5) ' }}>
        <Header />
        <Text className="text-4xl font-extrabold text-text">June 2025</Text>
        <Text className={`${styles.h2} opacity-50`}>June 25, 2025</Text>
        <Text className={`${styles.h5} opacity-50`}>So today I woke feeling like shit man</Text>
        <Text className={`${styles.h4} opacity-50`}>So today I wokefdsfsd feeling like</Text>
        <EntryView/>
      </View>

    </View>
  );
}
