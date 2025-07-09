import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';
import { SafeAreaView, View } from 'react-native';
import React, { useEffect } from 'react';
import '../../global.css';
import { initDatabase, createDummyData, clearDatabase } from 'db/initialization';
import { colors } from 'styles';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  useEffect(() => {
    const setupDB = async () => {
      await clearDatabase()
      await initDatabase();
      await createDummyData();
    };
    setupDB();
  }, []);
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.text,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#2b2435',
          borderTopWidth: 0,
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 60,
          position: 'absolute',
          overflow: 'hidden',
          elevation: 0,
          shadowColor: 'transparent',
          shadowOpacity: 0,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Entries',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
        }}
      />
      <Tabs.Screen
        name="alarm"
        options={{
          title: 'Alarm',
          tabBarIcon: ({ color }) => <TabBarIcon name="bell" color={color} />,
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Stats',
          tabBarIcon: ({ color }) => <TabBarIcon name="signal" color={color} />,
        }}
      />
    </Tabs>
  );
}
