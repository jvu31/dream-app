import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';
import { initDatabase } from 'db/initialization';
import { useEffect } from 'react'

export default function RootLayout() {

  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#FFFFFF',
          },
          
        }}>
        <Stack.Screen name="(tabs)"/>
      </Stack>
    </>
  );
}
