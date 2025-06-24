import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: '#000',
          },
          
        }}>
        <Stack.Screen name="(tabs)"/>
      </Stack>
    </>
  );
}
