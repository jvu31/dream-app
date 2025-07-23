import { Stack } from 'expo-router';
import { StatusBar } from 'react-native';

export default function RootLayout() {
  return (
    <>
      <StatusBar hidden={true} />
      <Stack
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
        }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="entry/[id]"
          options={{
            animation: 'slide_from_right',
            gestureEnabled: true,
          }}
        />
      </Stack>
    </>
  );
}
