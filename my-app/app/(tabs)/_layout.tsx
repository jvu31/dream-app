import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import '../../global.css';
import styles from '../../styles';
import FontAwesome from '@expo/vector-icons/FontAwesome';

function Icon(focused: any, icon: React.ComponentProps<typeof FontAwesome>['name'], title: string) {
  if (focused) {
    return (
      <Text className={styles.h1}>{title}</Text>
    )
  }
}

export default function Layout() {
  return (
    <Tabs
      screenOptions={{ 
        tabBarStyle: { 
          backgroundColor: '#2b2435', 
          marginBottom: 10
        },
        tabBarItemStyle: {
          justifyContent: "center",
          alignItems: "center"
        }
      }}>
      <Tabs.Screen name="index" options={{
        title: "JournalEntries",
        headerShown: false,
        tabBarIcon: ({ focused }) => (
          <Icon focused={focused} icon="home" title="Home" />
        )
      }}/>
      </Tabs>
  );
}